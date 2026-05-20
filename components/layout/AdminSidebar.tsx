'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Code2,
  LayoutDashboard,
  School,
  Users,
  FolderGit2,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AdminSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Classrooms', href: '/admin/classrooms', icon: School },
  { label: 'Teams', href: '/admin/teams', icon: Users },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
] as const;

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-navy text-white">
      {/* ---- Logo ---- */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/10">
        <Code2 className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">GitCode</span>
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-l-4 border-primary text-primary bg-white/5'
                      : 'border-l-4 border-transparent text-gray-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---- User section ---- */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary text-sm font-bold">
              {getInitials(user?.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? 'Admin User'}
            </p>
            <p className="truncate text-xs text-gray-400">
              {user?.email ?? 'admin@gitcode.dev'}
            </p>
          </div>

          <button
            className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus-ring"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
