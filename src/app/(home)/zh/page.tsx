import Link from 'next/link';
import { getDictionary } from '@/i18n/dict';
import {
  BookOpen,
  Globe,
  Zap,
  Settings,
  ArrowRight,
  Code2,
  Scale,
  ShieldCheck,
} from 'lucide-react';

const features = [
  { key: 'aiSearch' as const, icon: BookOpen, gradient: 'from-blue-500 to-cyan-500' },
  { key: 'i18n' as const, icon: Globe, gradient: 'from-emerald-500 to-teal-500' },
  { key: 'fast' as const, icon: Zap, gradient: 'from-amber-500 to-orange-500' },
  { key: 'customizable' as const, icon: Settings, gradient: 'from-purple-500 to-pink-500' },
];

export default function HomePageZh() {
  const dict = getDictionary('zh');

  return (
    <main className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="absolute top-[40%] right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-l from-cyan-500/8 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-screen-lg px-6 pt-28 pb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs text-fd-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {dict.home.badge}
          </div>

          <h1 className="bg-gradient-to-b from-fd-foreground to-fd-foreground/70 bg-clip-text text-5xl leading-tight font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            {dict.home.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground">
            {dict.home.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/zh/docs"
              className="inline-flex items-center gap-2 rounded-full bg-fd-foreground px-8 py-3 text-sm font-medium text-fd-background transition-all hover:opacity-90 hover:shadow-lg"
            >
              {dict.home.getStarted}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="https://github.com"
              className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-8 py-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              <Code2 className="size-4" />
              {dict.home.viewSource}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-fd-border bg-fd-card/30">
        <div className="mx-auto max-w-screen-lg px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            {dict.features.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const text = dict.features[feature.key];
              return (
                <div
                  key={feature.key}
                  className="group relative rounded-2xl border border-fd-border bg-fd-card p-6 transition-all hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 text-white shadow-sm`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{text.title}</h3>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">
                    {text.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-fd-border">
        <div className="mx-auto max-w-screen-lg px-6 py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold">{dict.cta.title}</h2>
          <p className="mx-auto mb-8 max-w-xl text-fd-muted-foreground">
            {dict.cta.description}
          </p>
          <Link
            href="/zh/docs"
            className="inline-flex items-center gap-2 rounded-full bg-fd-foreground px-8 py-3 text-sm font-medium text-fd-background transition-all hover:opacity-90"
          >
            {dict.cta.button}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-fd-border bg-fd-card/50">
        <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-fd-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} WebQ. {dict.footer.rights}</p>
          <div className="flex gap-6">
            <Link href="/zh/docs/privacy" className="inline-flex items-center gap-1.5 transition-colors hover:text-fd-foreground">
              <ShieldCheck className="size-3.5" />
              {dict.nav.privacy}
            </Link>
            <Link href="/zh/docs/terms" className="inline-flex items-center gap-1.5 transition-colors hover:text-fd-foreground">
              <Scale className="size-3.5" />
              {dict.nav.terms}
            </Link>
            <Link href="/" className="transition-colors hover:text-fd-foreground">
              English
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
