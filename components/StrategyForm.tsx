"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Compass, RefreshCcw, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildMockStrategy } from "@/data/strategy";
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
} from "@/data/filters";
import { createInterpretationFromFilters, examplePrompts, interpretProfilePrompt } from "@/data/profilePrompts";

const selectClassName =
  "h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80";

const defaultExamplePrompt =
  "Example: I am a fresh grad from a strong business school looking for consulting or strategy roles in Sydney or Melbourne, ideally with big-name firms.";

const initialInterpretation = createInterpretationFromFilters(
  defaultFilterState,
  "Default market setup",
);

export function StrategyForm() {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [promptText, setPromptText] = useState<string>(defaultExamplePrompt);
  const [activeInterpretation, setActiveInterpretation] = useState(initialInterpretation);
  const [isPending, startTransition] = useTransition();

  const strategy = buildMockStrategy(activeInterpretation);
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

  function generateFromPrompt(promptOverride?: string) {
    const nextPrompt = promptOverride ?? promptText;

    startTransition(() => {
      const nextInterpretation = nextPrompt.trim()
        ? interpretProfilePrompt(nextPrompt)
        : createInterpretationFromFilters(filters, "Manual strategy setup");

      setPromptText(nextPrompt);
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

  function applyFilters() {
    const manual = createInterpretationFromFilters(filters, "Applied current filters");
    setActiveInterpretation(manual);
  }

  function resetAll() {
    const manual = createInterpretationFromFilters(
      defaultFilterState,
      "Reset to default market",
    );

    setPromptText(defaultExamplePrompt);
    setFilters({
      country: manual.country,
      city: manual.city,
      industry: manual.industry,
      role: manual.role,
      careerStage: manual.careerStage,
      eventType: manual.eventType,
      organizerCredibility: manual.organizerCredibility,
      roiBand: manual.roiBand,
    });
    setActiveInterpretation(manual);
  }

  return (
    <div className="space-y-10">
      <Card className="border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.95))]">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                AI-Powered Strategy
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Describe your goals, background, and market preference
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Wand2 className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Prompt input is optional, but in the demo it takes priority because it shows the strongest product idea:
            natural language can configure the strategy automatically.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => generateFromPrompt(example.prompt)}
                    className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    {example.label}
              </button>
            ))}
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

              <textarea
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            placeholder="Describe your own goals, background, and preferred market here."
            className="mt-6 min-h-[140px] w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-emerald-300"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => generateFromPrompt()} disabled={isPending}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isPending ? "Generating..." : "Generate From Prompt"}
            </Button>
            <Button type="button" variant="secondary" onClick={applyFilters}>
              <Compass className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button type="button" variant="secondary" onClick={resetAll}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset all
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <Card className="border-slate-200/80 bg-white">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Expected Outcome
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{strategy.expectedOutcome}</h3>

            <div className="mt-6 space-y-3">
              {strategy.playbook.map((line) => (
                <div key={line} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700">
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button asChild variant="secondary">
                <Link href="/events">
                  Compare all filtered events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Top 3 Events This Month
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-950">
              These are the rooms Netly would prioritise first
            </h3>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {strategy.topEvents.map((event) => (
            <EventCard key={event.id} event={event} ctaLabel="Open event playbook" />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200/80 bg-white">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-semibold text-slate-950">Who to Target</h3>
            <div className="mt-6 space-y-5">
              {strategy.targetPersonas.map((persona) => (
                <div key={`${persona.title}-${persona.event}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-lg font-semibold text-slate-900">{persona.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{persona.focus}</p>
                  <p className="mt-3 text-sm font-medium text-emerald-700">{persona.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-semibold text-slate-950">Your Playbook</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The strategy output is still mock logic, but it now reads like a believable product flow rather
              than a static placeholder.
            </p>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.94))] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Demo framing
              </p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Users can either manually set filters or describe themselves in plain language. Netly then turns
                that into visible search criteria and ranked event recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
