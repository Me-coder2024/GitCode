'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Server,
  Palette,
  Container,
  Brain,
  Smartphone,
  Database,
  TestTube,
  GraduationCap,
  Rocket,
  Check,
  Users,
  Code2,
  Star,
  Zap,
} from 'lucide-react';

/* ──────────────────────────────────────────
   Static data
   ────────────────────────────────────────── */

const CATEGORIES = [
  { label: 'Web Dev', icon: Globe, bg: 'bg-pill-lavender', text: 'text-violet-700' },
  { label: 'Backend', icon: Server, bg: 'bg-pill-yellow', text: 'text-amber-700' },
  { label: 'UI/UX', icon: Palette, bg: 'bg-pill-blue', text: 'text-blue-700' },
  { label: 'DevOps', icon: Container, bg: 'bg-pill-green', text: 'text-emerald-700' },
  { label: 'AI/ML', icon: Brain, bg: 'bg-pill-pink', text: 'text-pink-700' },
  { label: 'Mobile', icon: Smartphone, bg: 'bg-pill-orange', text: 'text-orange-700' },
  { label: 'Database', icon: Database, bg: 'bg-pill-red', text: 'text-red-700' },
  { label: 'Testing', icon: TestTube, bg: 'bg-pill-indigo', text: 'text-indigo-700' },
] as const;

const FEATURE_BULLETS_LEFT = [
  'AI-powered section breakdowns for every project',
  'Step-by-step learning paths with real tasks',
  'Instructor dashboards with progress tracking',
];

const FEATURE_BULLETS_RIGHT = [
  'Git-based collaboration workflows',
  'Team code reviews and merge requests',
  'Deploy previews for every branch',
];

const DEMO_PROJECTS = [
  {
    name: 'E-Commerce API',
    stack: ['Node.js', 'Express', 'MongoDB'],
    teams: 8,
    gradient: 'from-primary to-emerald-400',
  },
  {
    name: 'Social Dashboard',
    stack: ['React', 'TypeScript', 'Tailwind'],
    teams: 12,
    gradient: 'from-accent-yellow to-amber-300',
  },
  {
    name: 'ML Pipeline',
    stack: ['Python', 'FastAPI', 'TensorFlow'],
    teams: 5,
    gradient: 'from-purple-500 to-violet-400',
  },
  {
    name: 'Chat Application',
    stack: ['Next.js', 'Socket.io', 'Redis'],
    teams: 10,
    gradient: 'from-blue-500 to-cyan-400',
  },
] as const;

/* ──────────────────────────────────────────
   Page
   ────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══════════════  A) HERO  ═══════════════ */}
      <section className="relative bg-gradient-to-b from-[#F0F0FF] via-white to-white py-20 md:py-28">
        {/* Dot pattern overlay */}
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-40" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* ── Left column ── */}
          <div className="animate-fade-in">
            {/* Badge pill */}
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🚀 Code Together with 1000+ Teams
            </span>

            <h1 className="text-5xl font-bold leading-tight text-navy md:text-6xl">
              Best Platform to
              <br />
              <span className="gradient-text">Collaborate & Build</span>
            </h1>

            <p className="mt-4 max-w-lg text-lg text-text-muted">
              Join your classroom, build with your team, and ship real projects
              together.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-dark hover:shadow-lg focus-ring"
              >
                Start Coding Now
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-7 py-3.5 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus-ring"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* ── Right column — decorative ── */}
          <div className="relative hidden lg:block">
            {/* Floating shapes */}
            <div className="absolute -right-6 -top-8 h-20 w-20 animate-float rounded-full bg-primary/20" />
            <div className="absolute -left-4 top-12 h-14 w-14 animate-float rounded-lg bg-accent-yellow/30 [animation-delay:1s]" />
            <div className="absolute bottom-4 right-16 h-10 w-10 animate-float rounded-full bg-accent-red/20 [animation-delay:0.5s]" />

            {/* Dotted grid */}
            <div className="absolute left-8 top-0 grid grid-cols-5 gap-3 opacity-30">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-navy" />
              ))}
            </div>

            {/* Code bracket symbols */}
            <span className="absolute -left-2 bottom-20 select-none text-5xl font-bold text-primary/15">
              {'{ }'}
            </span>
            <span className="absolute right-2 top-4 select-none text-4xl font-bold text-accent-yellow/20">
              {'< />'}
            </span>

            {/* Main stats card */}
            <div className="animate-slide-up rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">GitCode Stats</p>
                  <p className="text-xs text-text-muted">Live platform data</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-background p-3 text-center">
                  <p className="text-2xl font-bold text-navy">500+</p>
                  <p className="text-xs text-text-muted">Active Projects</p>
                </div>
                <div className="rounded-xl bg-background p-3 text-center">
                  <p className="text-2xl font-bold text-navy">2K+</p>
                  <p className="text-xs text-text-muted">Students</p>
                </div>
              </div>

              {/* Mini trust row */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                <Star className="h-4 w-4 text-accent-yellow" />
                <span className="text-xs font-medium text-navy">
                  Trusted by 50+ universities
                </span>
              </div>
            </div>

            {/* Floating completion card */}
            <div className="absolute -bottom-4 -left-8 animate-float rounded-2xl bg-white p-4 shadow-lg [animation-delay:0.7s]">
              <p className="text-sm font-semibold text-navy">98% Completion Rate</p>
              <div className="mt-2 h-2 w-36 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[98%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════  B) TOP CATEGORIES  ═══════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="animate-fade-in text-center text-3xl font-bold text-navy">
            Explore Top Categories
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-muted">
            Discover projects across every domain — from frontend to AI.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {CATEGORIES.map(({ label, icon: Icon, bg, text }) => (
              <button
                key={label}
                className={`${bg} ${text} card-hover flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════  C) FEATURES  ═══════════════ */}
      <section id="features" className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="animate-fade-in text-center text-3xl font-bold text-navy">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-muted">
            Built for modern coding education — from guided learning to
            real-world shipping.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card 1 */}
            <div className="card-hover rounded-2xl border border-border bg-white p-8 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-xl font-bold text-navy">
                Learn with Expert Guidance
              </h3>
              <p className="mt-2 text-text-muted">
                Get structured projects designed by instructors with AI-powered
                section breakdowns.
              </p>

              <ul className="mt-5 space-y-3">
                {FEATURE_BULLETS_LEFT.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 */}
            <div className="card-hover rounded-2xl border border-border bg-white p-8 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/15">
                <Rocket className="h-6 w-6 text-accent-yellow" />
              </div>

              <h3 className="text-xl font-bold text-navy">
                Build for Real Projects
              </h3>
              <p className="mt-2 text-text-muted">
                Work on actual codebases with Git workflows, just like in the
                industry.
              </p>

              <ul className="mt-5 space-y-3">
                {FEATURE_BULLETS_RIGHT.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════  D) POPULAR PROJECTS  ═══════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="animate-fade-in text-center text-3xl font-bold text-navy">
            Popular Projects
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-muted">
            See what teams are building right now on GitCode.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PROJECTS.map((project) => (
              <div
                key={project.name}
                className="card-hover group overflow-hidden rounded-2xl border border-border bg-white shadow-card"
              >
                {/* Gradient band */}
                <div
                  className={`h-2 w-full bg-gradient-to-r ${project.gradient}`}
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy">{project.name}</h3>

                  {/* Tech stack */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <Users className="h-3.5 w-3.5" />
                      {project.teams} teams
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════  E) CTA BANNER  ═══════════════ */}
      <section className="bg-background py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-navy px-6 py-12 sm:px-12 lg:py-16">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl" />

          <div className="relative z-10 text-center">
            <Zap className="mx-auto mb-4 h-8 w-8 text-accent-yellow" />
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to Start Building?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-400">
              Join thousands of students and teams shipping real projects on
              GitCode. It&#39;s free to get started.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-dark hover:shadow-lg focus-ring"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
