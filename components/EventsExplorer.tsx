"use client";

import { useState, useTransition } from "react";
import { RefreshCcw, Search, Sparkles, Wand2 } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  careerStageOptions,
  cityOptionsByCountry,
  countries,
  defaultFilterState,
  eventTypeOptions,
  industryOptions,
  organizerCredibilityOptions,
  roiBandOptions,
  roleOptions,
  type Country,
  type FilterState,
  type ProfileInterpretation,
} from "@/data/filters";
import { events, filterEvents } from "@/data/events";
import { createInterpretationFromFilters, examplePrompts, interpretProfilePrompt } from "@/data/profilePrompts";

const selectClassName =
  "h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80";

export function EventsExplorer() {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [promptText, setPromptText] = useState<string>(examplePrompts[0].prompt);
  const [interpretation, setInterpretation] = useState<ProfileInterpretation | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleEvents = filterEvents(events, filters);
  const cityOptions = cityOptionsByCountry[filters.country];

  function updateFilter<Key extends keyof FilterState>(key: Key, value: FilterState[Key]) {
    setFilters((current) => {
      if (key === "country") {
        return {
          ...current,
          country: value as Country,
          city: "All cities",
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  }

  function applyPrompt(prompt = promptText) {
    startTransition(() => {
      const nextInterpretation = prompt.trim()
        ? interpretProfilePrompt(prompt)
        : createInterpretationFromFilters(filters, "Manual filter selection");

      setPromptText(prompt);
      setInterpretation(nextInterpretation);
      setFilters({
        country: nextInterpretation.country,
        city: nextInterpretation.city,
        industry: nextInterpretation.industry,
        role: nextInterpretation.role,
        careerStage: nextInterpretation.careerStage,
        eventType: nextInterpretation.eventType,
        organizerCredibility: nextInterpretation.organizerCredibility,
        roiBand: nextInterpretation.roiBand,
      });
    });
  }

  function resetExplorer() {
    setPromptText("");
    setInterpretation(null);
    setFilters(defaultFilterState);
  }

  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Event Discovery"
          title="Search by market, role, and room quality instead of browsing blindly"
          description="The V2 demo adds country-to-city drill-down, richer taxonomy, and a natural-language prompt that visibly configures the filters for you."
          tone="inverse"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.95))]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    AI-Powered Demo
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Describe your situation</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <Wand2 className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                This is a mock LLM flow for the demo. Netly reads the prompt, interprets the target market,
                role, and background signal, then updates the visible filters.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => applyPrompt(example.prompt)}
                    className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    {example.label}
                  </button>
                ))}
              </div>

              <textarea
                value={promptText}
                onChange={(event) => setPromptText(event.target.value)}
                placeholder="I am a fresh grad from a strong business school looking for consulting or strategy roles in Sydney or Melbourne, ideally with big-name firms."
                className="mt-5 min-h-[140px] w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-emerald-300"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" onClick={() => applyPrompt()} disabled={isPending}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isPending ? "Interpreting..." : "Interpret My Profile"}
                </Button>
                <Button type="button" variant="secondary" onClick={resetExplorer}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset all
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Netly interpreted your profile as
              </p>

              {interpretation ? (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{interpretation.country}</Badge>
                    <Badge variant="info">
                      {interpretation.preferredCities.length
                        ? interpretation.preferredCities.join(" / ")
                        : interpretation.city}
                    </Badge>
                    <Badge variant="neutral">{interpretation.industry}</Badge>
                    <Badge variant="neutral">{interpretation.role}</Badge>
                    <Badge variant="warm">{interpretation.organizerCredibility}</Badge>
                  </div>

                  <div className="grid gap-3">
                    {interpretation.summaryLines.map((line) => (
                      <div key={line} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700">
                        {line}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-800">
                    Education signal: {interpretation.educationSignal}
                    <br />
                    Employer preference: {interpretation.employerPreference}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-sm leading-6 text-slate-500">
                  Use the prompt box to show how Netly converts a natural-language description into a visible search setup.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-slate-200/80 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Filters
                </p>
                <p className="text-base text-slate-600">
                  Default market: Australia → All cities. Every filter below is wired to the static dataset.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Badge>AI-adjustable filters</Badge>
              <Button type="button" variant="secondary" size="sm" onClick={resetExplorer}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset all
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Country
                <select
                  value={filters.country}
                  onChange={(event) => updateFilter("country", event.target.value as Country)}
                  className={selectClassName}
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                City
                <select
                  value={filters.city}
                  onChange={(event) => updateFilter("city", event.target.value)}
                  className={selectClassName}
                >
                  {cityOptions.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Industry
                <select
                  value={filters.industry}
                  onChange={(event) => updateFilter("industry", event.target.value)}
                  className={selectClassName}
                >
                  {industryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Role
                <select
                  value={filters.role}
                  onChange={(event) => updateFilter("role", event.target.value)}
                  className={selectClassName}
                >
                  {roleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Career stage
                <select
                  value={filters.careerStage}
                  onChange={(event) => updateFilter("careerStage", event.target.value)}
                  className={selectClassName}
                >
                  {careerStageOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Event type
                <select
                  value={filters.eventType}
                  onChange={(event) => updateFilter("eventType", event.target.value)}
                  className={selectClassName}
                >
                  {eventTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Organizer credibility
                <select
                  value={filters.organizerCredibility}
                  onChange={(event) => updateFilter("organizerCredibility", event.target.value)}
                  className={selectClassName}
                >
                  {organizerCredibilityOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                ROI band
                <select
                  value={filters.roiBand}
                  onChange={(event) => updateFilter("roiBand", event.target.value)}
                  className={selectClassName}
                >
                  {roiBandOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Results</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {visibleEvents.length} events in {filters.country}
              {filters.city !== "All cities" ? ` / ${filters.city}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">{filters.industry}</Badge>
            <Badge variant="neutral">{filters.role}</Badge>
            <Badge variant="warm">{filters.roiBand}</Badge>
          </div>
        </div>

        {visibleEvents.length ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="mt-8 border-dashed border-slate-200 bg-slate-50/70">
            <CardContent className="pt-6 text-sm leading-6 text-slate-600">
              No mock events match this exact combination yet. Try resetting one filter or use the prompt
              interpreter to show how Netly can broaden the search intelligently.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
