import Link from "next/link";
import { ArrowRight, Building2, Calendar, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import type { Event } from "@/data/events";
import { formatEventDate } from "@/lib/utils";
import { RoiStars } from "@/components/RoiStars";
import { Tag } from "@/components/Tag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type EventCardProps = {
  event: Event;
  ctaLabel?: string;
};

export function EventCard({ event, ctaLabel = "View Strategy" }: EventCardProps) {
  return (
    <Card className="group flex h-full flex-col border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lift">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{event.type}</Badge>
              <Badge variant="info">
                {event.city}, {event.country}
              </Badge>
            </div>

            <CardTitle className="text-2xl leading-tight">
              <Link href={`/events/${event.id}`} className="transition-colors hover:text-emerald-600">
                {event.name}
              </Link>
            </CardTitle>
            <p className="text-sm leading-6 text-slate-600">{event.whyItMatters}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2">
            <RoiStars score={event.roiScore} size="sm" showLabel={false} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="grid gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-950">{event.organizer.name}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{event.organizer.type}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {event.organizer.credibilityLabel}
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">{event.organizer.summary}</p>
        </div>

        <p className="text-sm leading-6 text-slate-600">{event.summary}</p>

        <div className="flex flex-wrap gap-2">
          {event.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {event.organizer.employerSignals.slice(0, 3).map((signal) => (
            <Tag key={signal} label={signal} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm">
          <div>
            <p className="text-slate-500">Top industry</p>
            <p className="mt-1 font-medium text-slate-900">{event.industry[0]}</p>
          </div>
          <div>
            <p className="text-slate-500">Best for</p>
            <p className="mt-1 font-medium text-slate-900">{event.roleRelevance[0]}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">
                Communication required: {event.communicationSkill.level}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{event.communicationSkill.description}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
