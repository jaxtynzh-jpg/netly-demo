import type { Event } from "@/data/events";
import { getRecommendedEvents } from "@/data/events";
import type { ProfileInterpretation } from "@/data/filters";

export type StrategyPersona = {
  title: string;
  focus: string;
  event: string;
};

export type MockStrategy = {
  interpretation: ProfileInterpretation;
  topEvents: Event[];
  targetPersonas: StrategyPersona[];
  playbook: string[];
  expectedOutcome: string;
};

function buildExpectedOutcome(events: Event[]) {
  if (!events.length) {
    return "Broaden the filters slightly to surface higher-signal rooms before making a prediction.";
  }

  const averageRoi = events.reduce((sum, event) => sum + event.roiScore, 0) / events.length;
  const confidence = Math.round(18 + averageRoi * 6);

  return `Based on similar users, following this plan has a ~${confidence}% chance of producing at least one referral within 30 days.`;
}

function buildPlaybook(interpretation: ProfileInterpretation, events: Event[]) {
  const firstEvent = events[0];
  const marketText = interpretation.preferredCities.length
    ? interpretation.preferredCities.join(" and ")
    : `${interpretation.country} major cities`;

  return [
    `Start by concentrating your energy in ${marketText} instead of spreading your time across low-signal rooms.`,
    `Prioritise employer-backed or credibility-rich rooms first, especially when targeting ${interpretation.role === "All roles" ? "early-career knowledge-work roles" : interpretation.role}.`,
    `Use your first conversation to test team reality, not to ask for a job. The fastest trust signal is specific curiosity about what the team is actually trying to solve.`,
    firstEvent
      ? `If you only attend one event first, make it ${firstEvent.name}. It has the strongest mix of hiring signal, organizer credit, and referral accessibility in this profile.`
      : "Start with rooms that show both recruiter visibility and operator density.",
  ];
}

function buildTargetPersonas(events: Event[]): StrategyPersona[] {
  return events
    .flatMap((event) =>
      event.targets.slice(0, 2).map((target) => ({
        title: target.role,
        focus: target.whyThem,
        event: event.name,
      })),
    )
    .slice(0, 3);
}

export function buildMockStrategy(interpretation: ProfileInterpretation): MockStrategy {
  const topEvents = getRecommendedEvents(interpretation, 3);

  return {
    interpretation,
    topEvents,
    targetPersonas: buildTargetPersonas(topEvents),
    playbook: buildPlaybook(interpretation, topEvents),
    expectedOutcome: buildExpectedOutcome(topEvents),
  };
}

