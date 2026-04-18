import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Filter,
  Globe2,
  LineChart,
  ShieldCheck,
} from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { comparisonRows, events } from "@/data/events";

const stats = [
  {
    value: "84%",
    label: "of job seekers believe networking matters",
    source: "Harris Poll, 2026",
  },
  {
    value: "59%",
    label: "do not know where to start networking",
    source: "Harris Poll, 2026",
  },
  {
    value: "4x",
    label: "higher hiring likelihood for referred candidates",
    source: "Industry benchmark",
  },
];

const steps = [
  {
    icon: Globe2,
    title: "Choose your market",
    description: "Start with country and city drill-down instead of treating every networking market the same.",
  },
  {
    icon: Filter,
    title: "Or describe yourself naturally",
    description: "Users can type their goals, background, and target market, then let Netly configure the filters for them.",
  },
  {
    icon: LineChart,
    title: "Rank rooms by ROI",
    description: "Events are scored on recruiter visibility, hiring pipeline, referral access, and audience relevance.",
  },
];

const features = [
  {
    title: "Geographic Drill-down",
    description: "Country → city filtering makes the product feel grounded in real local networking markets.",
    icon: Globe2,
  },
  {
    title: "Natural Language Filter Setup",
    description: "The demo now shows how Netly could translate a student's prompt into visible search criteria using an AI-powered interaction.",
    icon: BrainCircuit,
  },
  {
    title: "Organizer Credibility Layer",
    description: "Every event now surfaces who is hosting, why they matter, and what kind of room quality that implies.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  const heroEvent = events.find((event) => event.roiScore === 5) ?? events[0];
  const featuredEvents = events.filter((event) => event.roiScore >= 5).slice(0, 3);

  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <div className="tech-shell overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <div className="tech-chip">AI-Powered</div>
                <div className="tech-chip">Market-aware filters</div>
                <div className="tech-chip">Organizer intelligence</div>
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur">
                  Networking decision platform for early-career knowledge work
                </div>
                <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Stop guessing which networking events are worth your time
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-200">
                  Netly ranks networking rooms by hiring value, organizer credibility, and referral potential across
                  Australia, the US, the UK, and Canada.
                </p>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  Students can filter the market manually or describe themselves in natural language, then let an
                  AI-powered demo flow translate that into a sharper event strategy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/strategy">Try AI Strategy</Link>
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-white/25 bg-white/92">
              <CardHeader className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(240,249,255,0.92))]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                      Featured High-ROI Room
                    </p>
                    <CardTitle className="mt-2 text-3xl">{heroEvent.name}</CardTitle>
                  </div>
                  <Badge variant="warm">{heroEvent.organizer.credibilityLabel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">
                    {heroEvent.city}, {heroEvent.country}
                  </Badge>
                  <Badge variant="neutral">{heroEvent.organizer.name}</Badge>
                  <Badge>AI ranked</Badge>
                  <Badge>{heroEvent.roleRelevance[0]}</Badge>
                </div>

                <p className="text-base leading-7 text-slate-600">{heroEvent.whyItMatters}</p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-medium text-slate-500">Why this room matters</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{heroEvent.organizer.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {heroEvent.organizer.employerSignals.map((signal) => (
                    <Badge key={signal} variant="neutral">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-shell pt-16">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-slate-200/80 bg-white">
              <CardContent className="pt-6">
                <p className="text-4xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                <p className="mt-3 text-base leading-7 text-slate-700">{stat.label}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.source}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell pt-24">
        <SectionHeading
          eyebrow="How It Works"
          title="Netly upgrades event discovery into a market-aware decision flow"
          description="The product is no longer just a concept landing page. V2 shows a more believable workflow: choose a market, interpret the student profile, then rank rooms by actual signal quality."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card key={step.title} className="border-slate-200/80 bg-white">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section-shell pt-24">
        <SectionHeading
          eyebrow="Core Features"
          title="More filters, more room quality, and a stronger product story"
          description="The updated demo is still lightweight, but it now behaves like a real interface instead of a static poster. That makes the class walkthrough much easier."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="border-slate-200/80 bg-white">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section-shell pt-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Why not just LinkedIn or Meetup?"
            title="The gap is judgment, not access"
            description="Fresh grads can already find rooms. What they usually cannot do is rank them by market, organizer credibility, and likely job outcome."
          />

          <Card className="overflow-hidden border-slate-200/80 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Capability</th>
                    <th className="px-6 py-4 font-medium">LinkedIn</th>
                    <th className="px-6 py-4 font-medium">Meetup</th>
                    <th className="px-6 py-4 font-semibold text-slate-900">Netly</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.label}</td>
                      <td className="px-6 py-4 text-slate-600">{row.linkedin}</td>
                      <td className="px-6 py-4 text-slate-600">{row.meetup}</td>
                      <td className="px-6 py-4 font-medium text-emerald-700">{row.netly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-24">
        <SectionHeading
          eyebrow="Preview"
          title="High-ROI rooms across four western job markets"
          description="The dataset is now large enough to make filtering feel real. These sample cards show the richer event structure with organizer credit built in."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
