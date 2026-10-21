import Link from 'next/link';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { gitConfig } from '@/lib/shared';
import { homeProjects as projects } from '@/lib/home-projects';
import { SiteFooter } from '@/components/site-footer';
import { Reveal } from './reveal';
import {
  ArrowRight,
  Check,
  CodeXml,
  ExternalLink,
  Lightbulb,
  PencilRuler,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

/* ---------------------------------- data ---------------------------------- */

const workflowIcons: LucideIcon[] = [Lightbulb, PencilRuler, RefreshCw, Rocket];

const values: Array<{
  key: keyof ReturnType<typeof getDictionary>['values']['items'];
  icon: LucideIcon;
}> = [
  { key: 'pragmatic', icon: Target },
  { key: 'polished', icon: Sparkles },
  { key: 'open', icon: CodeXml },
  { key: 'privacy', icon: ShieldCheck },
];

/* --------------------------------- section -------------------------------- */

function SectionHeader({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
        {tag}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-fd-muted-foreground">{description}</p>
    </Reveal>
  );
}

/* ---------------------------------- page ---------------------------------- */

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const prefix = locale === 'zh' ? '/zh' : '';

  return (
    <main className="flex flex-1 flex-col">
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-25%] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/15 via-violet-500/10 to-transparent blur-3xl" />
          <div className="absolute top-[45%] right-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-to-l from-cyan-500/10 to-transparent blur-3xl" />
          <div className="absolute top-[30%] left-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-to-r from-amber-500/10 to-transparent blur-3xl" />
          {/* subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-fd-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fd-border)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_35%,black,transparent)]" />
        </div>

        <div className="mx-auto max-w-screen-lg px-6 pt-32 pb-20 text-center">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs text-fd-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {dict.home.badge}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="bg-gradient-to-b from-fd-foreground to-fd-foreground/60 bg-clip-text text-5xl leading-[1.1] font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
              {dict.home.tagline}
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground">
              {dict.home.description}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-fd-foreground px-8 py-3 text-sm font-medium text-fd-background shadow-sm transition-all duration-200 hover:shadow-lg hover:opacity-90 active:scale-95"
              >
                {dict.home.primaryCta}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-8 py-3 text-sm font-medium text-fd-foreground transition-all duration-200 hover:bg-fd-accent active:scale-95"
              >
                <ExternalLink className="size-4" />
                {dict.home.secondaryCta}
              </a>
            </div>
          </Reveal>

          {/* stats */}
          <Reveal delay={400}>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-fd-border bg-fd-border sm:grid-cols-4">
              {dict.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-fd-card px-4 py-5 transition-colors hover:bg-fd-accent/50">
                  <dd className="order-1 bg-gradient-to-b from-fd-foreground to-fd-foreground/70 bg-clip-text text-2xl font-bold text-transparent">
                    {stat.value}
                  </dd>
                  <dt className="order-2 mt-1 text-xs text-fd-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------- Projects -------------------------------- */}
      <section id="projects" className="scroll-mt-24 border-t border-fd-border bg-fd-card/30">
        <div className="mx-auto max-w-screen-lg px-6 py-24">
          <SectionHeader
            tag={dict.projects.tag}
            title={dict.projects.title}
            description={dict.projects.description}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => {
              const item = dict.projects.items[project.key];
              const Icon = project.icon;
              return (
                <Reveal key={project.key} delay={(i % 2) * 100}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl sm:p-8">
                    {/* hover glow */}
                    <div
                      className={`pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full ${project.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                    />
                    {/* hover accent border */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`inline-flex rounded-xl bg-gradient-to-br ${project.accent} p-3 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.name}
                        className="inline-flex rounded-lg p-2 text-fd-muted-foreground opacity-0 transition-all duration-200 hover:bg-fd-accent hover:text-fd-foreground focus-visible:opacity-100 group-hover:opacity-100 active:scale-90"
                      >
                        <ExternalLink className="size-4.5" />
                      </a>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium text-fd-muted-foreground">{item.tagline}</p>

                    <div className="mt-5 flex flex-col gap-2.5">
                      {item.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-sm text-fd-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                          <span className="leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-fd-accent px-2.5 py-0.5 text-xs text-fd-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-primary active:scale-95"
                      >
                        {dict.projects.learnMore}
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------- Workflow -------------------------------- */}
      <section id="workflow" className="scroll-mt-24 border-t border-fd-border">
        <div className="mx-auto max-w-screen-lg px-6 py-24">
          <SectionHeader
            tag={dict.workflow.tag}
            title={dict.workflow.title}
            description={dict.workflow.description}
          />

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.workflow.steps.map((step, i) => {
              const Icon = workflowIcons[i] ?? Lightbulb;
              return (
                <Reveal key={step.title} delay={i * 100}>
                  <li className="group relative h-full rounded-2xl border border-fd-border bg-fd-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-fd-border transition-colors duration-300 group-hover:text-fd-foreground/20">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon className="size-6 text-fd-muted-foreground transition-all duration-300 group-hover:text-fd-foreground group-hover:scale-110" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                      {step.description}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* --------------------------------- Values --------------------------------- */}
      <section id="values" className="scroll-mt-24 border-t border-fd-border bg-fd-card/30">
        <div className="mx-auto max-w-screen-lg px-6 py-24">
          <SectionHeader
            tag={dict.values.tag}
            title={dict.values.title}
            description={dict.values.description}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => {
              const item = dict.values.items[value.key];
              const Icon = value.icon;
              return (
                <Reveal key={value.key} delay={(i % 2) * 100}>
                  <div className="group h-full rounded-2xl border border-fd-border bg-fd-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
                    <div className="mb-4 inline-flex rounded-xl border border-fd-border bg-fd-accent/50 p-2.5 text-fd-foreground transition-all duration-300 group-hover:bg-fd-accent group-hover:scale-110">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-fd-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Stack --------------------------------- */}
      <section id="stack" className="scroll-mt-24 border-t border-fd-border">
        <div className="mx-auto max-w-screen-lg px-6 py-24">
          <Reveal className="text-center">
            <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
              {dict.stack.tag}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {dict.stack.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-fd-muted-foreground">
              {dict.stack.description}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {dict.stack.items.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 60}>
                <div className="group flex h-full flex-col items-center justify-center rounded-xl border border-fd-border bg-fd-card px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-fd-primary/40 hover:shadow-md">
                  <span className="text-sm font-semibold">{tech.name}</span>
                  <span className="mt-1 text-xs text-fd-muted-foreground">{tech.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------- CTA ----------------------------------- */}
      <section className="relative overflow-hidden border-t border-fd-border">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute bottom-[-60%] left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-t from-blue-500/15 via-violet-500/10 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-screen-lg px-6 py-24 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{dict.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">{dict.cta.description}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`${prefix}/docs`}
                className="group inline-flex items-center gap-2 rounded-full bg-fd-foreground px-8 py-3 text-sm font-medium text-fd-background shadow-sm transition-all duration-200 hover:shadow-lg hover:opacity-90 active:scale-95"
              >
                {dict.cta.primary}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-8 py-3 text-sm font-medium text-fd-foreground transition-all duration-200 hover:bg-fd-accent active:scale-95"
              >
                <ExternalLink className="size-4" />
                {dict.cta.secondary}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------- Footer ---------------------------------- */}
      <SiteFooter locale={locale} />
    </main>
  );
}
