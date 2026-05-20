'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Code2 } from 'lucide-react';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/hooks/useAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, isAdmin, loading } = useAuth();

  // Redirect after successful login
  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isAdmin, loading, router, searchParams]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-white to-primary/5 px-4">
      {/* ── Floating decorative shapes ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-1/4 h-48 w-48 animate-float rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -right-20 bottom-1/3 h-56 w-56 animate-float rounded-full bg-accent-yellow/10 blur-2xl [animation-delay:1.2s]" />
        <div className="absolute left-1/3 top-12 h-20 w-20 animate-float rounded-full bg-accent-red/10 blur-xl [animation-delay:0.6s]" />
        {/* Small dots */}
        <div className="absolute right-1/4 top-1/4 grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-navy" />
          ))}
        </div>
        {/* Code brackets */}
        <span className="absolute bottom-20 left-16 select-none text-6xl font-bold text-primary/5">
          {'{ }'}
        </span>
        <span className="absolute right-16 top-20 select-none text-5xl font-bold text-accent-yellow/8">
          {'< />'}
        </span>
      </div>

      {/* ── Login card ── */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-2 flex items-center justify-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">GitCode</span>
          </div>

          {/* Tagline */}
          <p className="text-center text-sm text-text-muted">
            Welcome back! Sign in to continue.
          </p>

          {/* Decorative separator */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-text-muted">
              Sign in with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google sign-in */}
          <GoogleLoginButton onClick={signIn} loading={loading} />

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-text-muted">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Subtle bottom text */}
        <p className="mt-6 text-center text-xs text-text-muted/60">
          Collaborate · Build · Ship — Powered by GitCode
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-navy text-lg font-semibold animate-pulse">Loading auth...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
