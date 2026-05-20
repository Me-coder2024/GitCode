'use client'

import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar */}
      <AdminSidebar
        user={
          user
            ? {
                name: user.name ?? 'Admin User',
                email: user.email,
                avatar_url: user.avatar_url ?? undefined,
              }
            : undefined
        }
      />

      {/* Main content area */}
      <main className="ml-64 flex-1 bg-background min-h-screen p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-text-muted">Loading…</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
