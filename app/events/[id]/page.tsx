import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, MapPin, ShieldCheck, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { RoiStars } from "@/components/RoiStars";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events, getEventById } from "@/data/events";
import { formatEventDate, formatEventTime } from "@/lib/utils";

type PageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const event = getEventById(params.id);

  if (!event) {
    return {
      title: "Event Not Found | Netly",
    };
  }

  return {
    title: `${event.name} | Netly`,
    description: event.summary,
  };
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function EventDetailPage({ params }: PageProps) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{event.type}</Badge>
              <Badge variant="info">
                {event.city}, {event.country}
              </Badge>
              <Badge variant="warm">{event.organizer.credibilityLabel}</Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {event.name}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-200">{event.whyItMatters}</p>
              <p className="max-w-3xl text-base leading-7 text-slate-300">{event.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm text-slate-500">Date</p>
                <p className="mt-1 font-medium text-slate-900">{formatEventDate(event.date)}</p>
                <p className="text-sm text-slate-500">{formatEventTime(event.date)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm text-slate-500">Location</p>
                <p className="mt-1 font-medium text-slate-900">{event.location}</p>
                <p className="text-sm text-slate-500">{event.city}, {event.country}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <Users className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm text-slate-500">Organizer</p>
                <p className="mt-1 font-medium text-slate-900">{event.organizer.name}</p>
                <p className="text-sm text-slate-500">{event.organizer.type}</p>
              </div>
            </div>
          </div>

          <Card className="border-emerald-100 bg-white">
            <CardHeader className="border-b border-slate-100">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
                ROI Score
              </p>
              <CardTitle className="mt-2 flex items-center justify-between gap-4 text-3xl">
                <span>{event.roiScore}-star event</span>
                <RoiStars score={event.roiScore} size="lg" showLabel={false} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <p className="text-base leading-7 text-slate-600">
                This event scores highly because it blends organizer credibility with visible hiring signal.
                Netly’s logic is not just about whether the room exists, but whether it is likely to create
                a concrete next step.
              </p>
              <ScoreBar label="HR / Recruiter presence" value={event.roiBreakdown.hrPresence} />
              <ScoreBar label="Hiring pipeline potential" value={event.roiBreakdown.hiringPipeline} />
              <ScoreBar label="Referral accessibility" value={event.roiBreakdown.referralAccess} />
              <ScoreBar label="Audience relevance" value={event.roiBreakdown.audienceRelevance} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-20">
        <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr]">
          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Organizer Credibility
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-950">{event.organizer.name}</h2>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="warm">{event.organizer.credibilityLabel}</Badge>
                <Badge variant="neutral">{event.organizer.type}</Badge>
                {event.organizer.employerSignals.map((signal) => (
                  <Tag key={signal} label={signal} />
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Why this organizer matters
                </p>
                <p className="mt-3 text-base leading-7 text-slate-600">{event.organizer.summary}</p>
                <p className="mt-3 text-base leading-7 text-slate-600">{event.whyItMatters}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Room Signals
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Why this room is worth your time</h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">Top industry</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{event.industry[0]}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">Best first target</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{event.roleRelevance[0]}</p>
                </div>
              </div>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Netly does not treat every event equally. It explains whether the organizer has real credit,
                whether the audience is role-relevant, and whether the room can realistically generate a referral or interview path.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-20">
        <SectionHeading
          eyebrow="Who You Should Talk To"
          title="Prioritise people with context, not just status"
          description="The playbook is intentionally practical. The goal is to show users which conversations are most likely to convert the room into a useful next step."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {event.targets.map((target) => (
            <Card key={target.role} className="border-slate-200/80 bg-white">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-slate-950">{target.role}</h3>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Why them
                </p>
                <p className="mt-2 text-base leading-7 text-slate-600">{target.whyThem}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                  How to spot them
                </p>
                <p className="mt-2 text-base leading-7 text-slate-600">{target.howToSpot}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell pt-20">
        <SectionHeading
          eyebrow="Conversation Playbook"
          title="This is still the differentiating product moment"
          description="V2 adds more filters and more data, but the core feature is still the same: turn room choice into real conversation strategy."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-slate-950">Opener</h3>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                {event.playbook.opener.map((item) => (
                  <li key={item}>“{item}”</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-slate-950">Discovery Questions</h3>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                {event.playbook.discoveryQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-slate-950">How to ask for a referral</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{event.playbook.referralAsk}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-slate-950">Follow-up template</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{event.playbook.followUp}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-20">
        <Card className="border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.94),rgba(255,255,255,0.94))]">
          <CardContent className="pt-6">
            <SectionHeading
              eyebrow="Outcome Feedback"
              title="Did you attend this event?"
              description="The buttons remain mock-only, but they hint at the longer-term moat: Netly learning which rooms actually convert into referrals and interviews."
            />
            <div className="mt-6">
              <FeedbackButtons />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
