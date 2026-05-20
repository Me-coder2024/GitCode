'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth, signInWithGoogle as firebaseSignIn } from '@/lib/firebase'
import { User } from '@/types'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Fetch or create the Supabase user record from the Firebase user
  const fetchUserProfile = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken()

      // Set the firebase-token cookie for API route auth
      document.cookie = `firebase-token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: idToken,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch user profile')
      }

      const data = await res.json()
      const supabaseUser: User = data.user
      setUser(supabaseUser)
      setIsAdmin(supabaseUser.role === 'admin')
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to load user profile')
      setUser(null)
      setIsAdmin(false)
    }
  }, [])

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)

      if (fbUser) {
        await fetchUserProfile(fbUser)
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [fetchUserProfile])

  // Sign in with Google
  const signIn = useCallback(async () => {
    try {
      setLoading(true)
      const result = await firebaseSignIn()
      if (result.user) {
        await fetchUserProfile(result.user)
        toast.success('Signed in successfully!')
      }
    } catch (error) {
      console.error('Sign-in error:', error)
      toast.error('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }, [fetchUserProfile])

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await auth.signOut()
      setUser(null)
      setFirebaseUser(null)
      setIsAdmin(false)

      // Clear the firebase-token cookie
      document.cookie = 'firebase-token=; path=/; max-age=0; SameSite=Lax'

      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      console.error('Sign-out error:', error)
      toast.error('Failed to sign out')
    }
  }, [router])

  return {
    user,
    firebaseUser,
    loading,
    signIn,
    signOut,
    isAdmin,
  }
}
