'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Classrooms', href: '/classrooms' },
  { label: 'About', href: '/about' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Placeholder — will be wired to auth context later
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-lg">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">GitCode</span>
        </Link>

        {/* ---- Desktop links ---- */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-text-muted hover:text-primary',
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ---- Right section ---- */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
              U
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* ---- Mobile hamburger ---- */}
        <button
          className="md:hidden rounded-lg p-2 text-text-muted hover:bg-gray-100 transition-colors focus-ring"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* ---- Mobile menu ---- */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white animate-slide-down">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-text-muted hover:bg-gray-50 hover:text-navy',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border px-4 py-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                  U
                </div>
                <span className="text-sm text-navy font-medium">User</span>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
