import type { FilterState, ProfileInterpretation } from "@/data/filters";

type EventType = "Meetup" | "Info Session" | "Pitch Night" | "Conference" | "Panel";
type OrganizerType = "Employer" | "University" | "Association" | "Community" | "Startup";
type CareerStage = "Student" | "Fresh Grad" | "1-3 Years";
type CommunicationSkillLevel = "Low" | "Moderate" | "High" | "Advanced";

export type Event = {
  id: string;
  name: string;
  date: string;
  country: "Australia" | "United States" | "United Kingdom" | "Canada";
  city: string;
  location: string;
  organizer: {
    name: string;
    type: OrganizerType;
    credibilityLabel: string;
    credibilityTier: 1 | 2 | 3;
    employerSignals: string[];
    summary: string;
  };
  type: EventType;
  industry: string[];
  roleRelevance: string[];
  careerStage: CareerStage[];
  communicationSkill: {
    level: CommunicationSkillLevel;
    label: string;
    description: string;
  };
  roiScore: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  summary: string;
  whyItMatters: string;
  roiBreakdown: {
    hrPresence: number;
    hiringPipeline: number;
    referralAccess: number;
    audienceRelevance: number;
  };
  targets: {
    role: string;
    whyThem: string;
    howToSpot: string;
  }[];
  playbook: {
    opener: string[];
    discoveryQuestions: string[];
    referralAsk: string;
    followUp: string;
  };
};

type EventSeed = Omit<Event, "roiBreakdown" | "targets" | "playbook" | "communicationSkill">;

function makeOrganizer(
  name: string,
  type: OrganizerType,
  credibilityLabel: Event["organizer"]["credibilityLabel"],
  credibilityTier: 1 | 2 | 3,
  employerSignals: string[],
): Event["organizer"] {
  const summaries: Record<OrganizerType, string> = {
    Employer: `${name} is employer-backed and tends to attract recruiter visibility plus direct operator context.`,
    University: `${name} adds school brand, alumni density, and structured employer access to the room.`,
    Association: `${name} brings professional credibility and a more curated industry audience.`,
    Community: `${name} is a repeat local host with strong connectivity, though room quality can vary session to session.`,
    Startup: `${name} offers founder access and startup energy, but hiring signal depends heavily on sponsor mix and stage.`,
  };

  return {
    name,
    type,
    credibilityLabel,
    credibilityTier,
    employerSignals,
    summary: summaries[type],
  };
}

function clampScore(score: number) {
  return Math.max(1, Math.min(5, score)) as 1 | 2 | 3 | 4 | 5;
}

function buildRoiBreakdown(seed: EventSeed): Event["roiBreakdown"] {
  const baseMap = {
    1: { hrPresence: 1, hiringPipeline: 1, referralAccess: 1, audienceRelevance: 2 },
    2: { hrPresence: 1, hiringPipeline: 2, referralAccess: 2, audienceRelevance: 2 },
    3: { hrPresence: 2, hiringPipeline: 3, referralAccess: 3, audienceRelevance: 3 },
    4: { hrPresence: 3, hiringPipeline: 4, referralAccess: 4, audienceRelevance: 4 },
    5: { hrPresence: 4, hiringPipeline: 5, referralAccess: 4, audienceRelevance: 5 },
  }[seed.roiScore];

  const tagText = seed.tags.join(" ").toLowerCase();

  return {
    hrPresence: clampScore(baseMap.hrPresence + (tagText.includes("recruiter") || tagText.includes("hr") ? 1 : 0)),
    hiringPipeline: clampScore(baseMap.hiringPipeline + (tagText.includes("pipeline") ? 1 : 0)),
    referralAccess: clampScore(
      baseMap.referralAccess + (tagText.includes("easy referral") || tagText.includes("alumni") ? 1 : 0),
    ),
    audienceRelevance: clampScore(
      baseMap.audienceRelevance + (tagText.includes("operator-heavy") || tagText.includes("targeted") ? 1 : 0),
    ),
  };
}

function buildTargets(seed: EventSeed): Event["targets"] {
  const primaryRole = seed.roleRelevance[0] ?? "Business Analyst";
  const secondaryRole = seed.roleRelevance[1] ?? primaryRole;
  const industryLabel = seed.industry[0].toLowerCase();

  const anchorTarget = {
    role: `Mid-level ${primaryRole} at a ${industryLabel} team`,
    whyThem: "They know what the team is actually hiring for and can translate your background into concrete role fit.",
    howToSpot: "Look for people speaking practically about team roadmaps, hiring priorities, or cross-functional work.",
  };

  const organizerTargetByType: Record<OrganizerType, Event["targets"][number]> = {
    Employer: {
      role: "Talent partner or campus recruiter",
      whyThem: "They can tell you whether the event is tied to real hiring demand or just employer branding.",
      howToSpot: "Usually stationed near branded tables, sponsor booths, or host introductions.",
    },
    University: {
      role: "Alumni mentor or careers lead",
      whyThem: "Shared school context lowers friction and makes a follow-up message feel much warmer.",
      howToSpot: "Watch for alumni badges, volunteer tags, or introductions tied to university societies.",
    },
    Association: {
      role: `${secondaryRole} involved in an industry committee`,
      whyThem: "Association regulars often know which employers consistently send high-signal attendees.",
      howToSpot: "Find the people moderating panels, hosting Q&A, or greeting known members by name.",
    },
    Community: {
      role: "Community organiser or repeat attendee",
      whyThem: "They may not hire directly, but they know which future rooms are worth prioritising next.",
      howToSpot: "Look for hosts managing the room flow, introductions, or sponsor relationships.",
    },
    Startup: {
      role: "Founder or first business hire",
      whyThem: "In startup rooms, these are the people most able to turn a useful conversation into a fast follow-up.",
      howToSpot: "Look for presenters, hosts, or the people answering company-building and hiring questions directly.",
    },
  };

  return [
    anchorTarget,
    organizerTargetByType[seed.organizer.type],
    {
      role: `Peer-to-near-peer ${secondaryRole}`,
      whyThem: "Someone slightly ahead of you can explain what actually gets noticed after the event and whether the room is worth repeating.",
      howToSpot: "Find attendees who recently broke into the kind of role you want and who speak concretely about that transition.",
    },
  ];
}

function buildPlaybook(seed: EventSeed): Event["playbook"] {
  const primaryRole = seed.roleRelevance[0] ?? "Business Analyst";
  const industryLabel = seed.industry[0].toLowerCase();

  return {
    opener: [
      `For someone targeting ${primaryRole} roles, what makes this room genuinely high-signal rather than just broadly social?`,
      `Which teams here are most worth meeting if I want to break into ${industryLabel} work without wasting time?`,
      `What usually makes an early-career candidate feel useful quickly in your corner of ${industryLabel}?`,
    ],
    discoveryQuestions: [
      "Which employers or teams in this room are actually moving on hiring soon?",
      "What makes a post-event follow-up feel specific and worth responding to?",
      "If someone gets a referral from this kind of room, what usually made that conversation credible?",
      "Who in the room would you prioritise if the goal were a practical next step, not just exposure?",
    ],
    referralAsk:
      "If our conversation feels relevant after we chat, would you be open to pointing me toward the best person or team to follow up with?",
    followUp: `Thanks again for the conversation at ${seed.name}. Your advice on how to approach ${industryLabel} networking more strategically gave me a much clearer sense of which next step actually matters. I would love to stay in touch and follow up on the teams or people you mentioned.`,
  };
}

function buildCommunicationRequirement(seed: EventSeed): Event["communicationSkill"] {
  const tagText = seed.tags.join(" ").toLowerCase();
  let level: CommunicationSkillLevel = "Moderate";

  if (seed.type === "Info Session" || tagText.includes("employer booths") || tagText.includes("broad audience")) {
    level = "Low";
  }

  if (seed.type === "Panel" || seed.type === "Conference" || tagText.includes("high alumni density")) {
    level = "Moderate";
  }

  if (
    seed.type === "Meetup" ||
    tagText.includes("operator-heavy") ||
    tagText.includes("easy referral") ||
    tagText.includes("recruiter-visible")
  ) {
    level = "High";
  }

  if (
    seed.type === "Pitch Night" ||
    seed.organizer.type === "Startup" ||
    tagText.includes("founder access") ||
    tagText.includes("investor-heavy")
  ) {
    level = "Advanced";
  }

  const details: Record<CommunicationSkillLevel, Omit<Event["communicationSkill"], "level">> = {
    Low: {
      label: "Low communication load",
      description: "Structured room with clearer prompts, booths, or presentations. Good for students still building confidence.",
    },
    Moderate: {
      label: "Moderate communication load",
      description: "Requires basic small talk, Q&A, and a few targeted follow-ups, but the room gives enough structure.",
    },
    High: {
      label: "High communication load",
      description: "Needs confident openers, active follow-up, and the ability to steer conversations toward referrals.",
    },
    Advanced: {
      label: "Advanced communication load",
      description: "Unstructured founder or investor-heavy room where outcomes depend on fast trust-building and cold approaches.",
    },
  };

  return {
    level,
    ...details[level],
  };
}

const eventSeeds: EventSeed[] = [
  {
    id: "sydney-consulting-insiders-panel",
    name: "Sydney Consulting Insiders Panel",
    date: "2026-05-19T18:00:00+10:00",
    country: "Australia",
    city: "Sydney",
    location: "Barangaroo, Sydney",
    organizer: makeOrganizer(
      "Consulting Collective ANZ",
      "Association",
      "Major industry association",
      3,
      ["Big 4", "Recruiter-visible", "High alumni density"],
    ),
    type: "Panel",
    industry: ["Consulting"],
    roleRelevance: ["Business Analyst", "Strategy Analyst", "Associate Consultant"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 5,
    tags: ["Recruiter-visible", "High alumni density", "Hiring pipeline"],
    summary: "A polished consulting room with clear employer presence and practical alumni access.",
    whyItMatters: "This room compresses employer visibility, alumni density, and structured next-step advice into one event.",
  },
  {
    id: "sydney-fintech-operator-roundtable",
    name: "Sydney Fintech Operator Roundtable",
    date: "2026-05-26T18:30:00+10:00",
    country: "Australia",
    city: "Sydney",
    location: "Circular Quay, Sydney",
    organizer: makeOrganizer(
      "Visa Career Network APAC",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Hiring managers", "Recruiter-visible"],
    ),
    type: "Meetup",
    industry: ["Fintech", "Business Operations"],
    roleRelevance: ["Strategy Analyst", "Operations Analyst", "Product Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Easy referral", "Hiring pipeline"],
    summary: "A smaller fintech room where operators and hiring teams talk openly about growth and execution work.",
    whyItMatters: "Compared with broad startup socials, this room gives better signal on real fintech team needs and who can refer.",
  },
  {
    id: "sydney-startup-pitch-night",
    name: "Sydney Startup Pitch Night",
    date: "2026-06-03T18:30:00+10:00",
    country: "Australia",
    city: "Sydney",
    location: "Surry Hills, Sydney",
    organizer: makeOrganizer(
      "Startmate Sydney",
      "Startup",
      "Startup / founder-led",
      2,
      ["Founder access", "Startup operators"],
    ),
    type: "Pitch Night",
    industry: ["VC / Startups", "Partnerships / BD"],
    roleRelevance: ["Founder Associate", "Business Development Associate", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Investor-heavy", "Social only"],
    summary: "High energy and founder-rich, but inconsistent if your goal is structured hiring conversations.",
    whyItMatters: "Useful if you already know how to steer founder conversations, but weak if you need predictable recruiting signal.",
  },
  {
    id: "melbourne-customer-growth-roundtable",
    name: "Melbourne Customer Growth Roundtable",
    date: "2026-05-21T18:15:00+10:00",
    country: "Australia",
    city: "Melbourne",
    location: "Southbank, Melbourne",
    organizer: makeOrganizer(
      "HubSpot Community Melbourne",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Operator-heavy", "Recruiter-visible"],
    ),
    type: "Info Session",
    industry: ["Marketing", "Product"],
    roleRelevance: ["Growth Associate", "Marketing Associate", "Product Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Easy referral", "Targeted audience"],
    summary: "A focused growth and lifecycle room that surfaces real customer-strategy conversations.",
    whyItMatters: "This is a stronger room than generic marketing meetups because the hosts and attendees talk directly about team needs.",
  },
  {
    id: "melbourne-strategy-ops-career-forum",
    name: "Melbourne Strategy & Ops Career Forum",
    date: "2026-06-05T17:45:00+10:00",
    country: "Australia",
    city: "Melbourne",
    location: "Docklands, Melbourne",
    organizer: makeOrganizer(
      "Monash Industry Futures",
      "University",
      "Top university-backed",
      3,
      ["Top university", "High alumni density", "Employer booths"],
    ),
    type: "Conference",
    industry: ["Business Operations", "Consulting"],
    roleRelevance: ["Strategy Analyst", "Operations Analyst", "Program Manager"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 5,
    tags: ["Top university", "Recruiter-visible", "Hiring pipeline"],
    summary: "A university-backed forum that blends alumni operators with employer-backed strategy and ops sessions.",
    whyItMatters: "The room is structured enough to feel high-credibility, but still open enough for warm conversations instead of only formal recruiting booths.",
  },
  {
    id: "melbourne-founder-mixer",
    name: "Melbourne Founder Mixer",
    date: "2026-06-18T18:30:00+10:00",
    country: "Australia",
    city: "Melbourne",
    location: "Collingwood, Melbourne",
    organizer: makeOrganizer(
      "LaunchVic Community",
      "Community",
      "Alumni-led community",
      2,
      ["Founder access", "Local network"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Partnerships / BD"],
    roleRelevance: ["Founder Associate", "Partnerships Associate", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Broad audience", "Social only"],
    summary: "Good for local startup awareness, but weaker on direct hiring pathways.",
    whyItMatters: "Better used as a secondary room after you already know which startup operators you want to meet.",
  },
  {
    id: "brisbane-business-analytics-exchange",
    name: "Brisbane Business Analytics Exchange",
    date: "2026-05-27T18:00:00+10:00",
    country: "Australia",
    city: "Brisbane",
    location: "Fortitude Valley, Brisbane",
    organizer: makeOrganizer(
      "Analytics Queensland",
      "Association",
      "Major industry association",
      3,
      ["Major association", "Operator-heavy", "Recruiter-visible"],
    ),
    type: "Meetup",
    industry: ["Business Operations", "Finance"],
    roleRelevance: ["Business Analyst", "Finance Analyst", "Operations Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Targeted audience", "Easy referral"],
    summary: "A practical analytics room with genuine employer density rather than just general networking energy.",
    whyItMatters: "It is especially useful for students who want analyst roles but need a clearer sense of which teams value business-facing analysis.",
  },
  {
    id: "brisbane-university-employer-night",
    name: "Brisbane University Employer Night",
    date: "2026-06-10T17:30:00+10:00",
    country: "Australia",
    city: "Brisbane",
    location: "St Lucia, Brisbane",
    organizer: makeOrganizer(
      "University of Queensland Careers",
      "University",
      "Top university-backed",
      3,
      ["Top university", "Employer booths", "High alumni density"],
    ),
    type: "Info Session",
    industry: ["Consulting", "Technology"],
    roleRelevance: ["Business Analyst", "Product Analyst", "Program Manager"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 3,
    tags: ["Top university", "Recruiter-visible", "Student-friendly"],
    summary: "A broad but still useful employer night with campus credibility and visible recruiter presence.",
    whyItMatters: "Not every employer booth is high ROI, but the structured format lowers the cost of finding out which ones are real.",
  },
  {
    id: "brisbane-startup-community-social",
    name: "Brisbane Startup Community Social",
    date: "2026-06-24T18:30:00+10:00",
    country: "Australia",
    city: "Brisbane",
    location: "New Farm, Brisbane",
    organizer: makeOrganizer(
      "River City Founders",
      "Community",
      "Alumni-led community",
      1,
      ["Founder access", "Local network"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Product"],
    roleRelevance: ["Founder Associate", "Product Analyst", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 1,
    tags: ["Social only", "Broad audience", "Founder access"],
    summary: "Friendly and accessible, but too broad to be a reliable first bet for job-focused networking.",
    whyItMatters: "This is the kind of room Netly should deliberately rank lower so users do not confuse warmth with hiring value.",
  },
  {
    id: "perth-finance-deals-network-panel",
    name: "Perth Finance & Deals Network Panel",
    date: "2026-05-28T18:00:00+08:00",
    country: "Australia",
    city: "Perth",
    location: "Perth CBD",
    organizer: makeOrganizer(
      "CFA Society Perth",
      "Association",
      "Major industry association",
      3,
      ["Major association", "Finance employers", "Recruiter-visible"],
    ),
    type: "Panel",
    industry: ["Finance", "Consulting"],
    roleRelevance: ["Finance Analyst", "Business Analyst", "Strategy Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Recruiter-visible", "Targeted audience", "Hiring pipeline"],
    summary: "A finance-heavy room with better-than-average clarity on employer quality and referral paths.",
    whyItMatters: "This room is especially useful when students want finance-adjacent roles but are unsure which employers in Perth are actually visible.",
  },
  {
    id: "perth-product-operations-builders-meetup",
    name: "Perth Product & Operations Builders Meetup",
    date: "2026-06-11T18:15:00+08:00",
    country: "Australia",
    city: "Perth",
    location: "Subiaco, Perth",
    organizer: makeOrganizer(
      "Atlassian APAC Community",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Operator-heavy", "Hiring managers"],
    ),
    type: "Meetup",
    industry: ["Product", "Business Operations"],
    roleRelevance: ["Product Analyst", "Operations Analyst", "Program Manager"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Operator-heavy", "Easy referral", "Recruiter-visible"],
    summary: "Good for product-adjacent generalists, though the room is smaller and more relationship-driven than employer fairs.",
    whyItMatters: "This is the kind of mid-signal event that becomes useful once the user already knows which operators to prioritise.",
  },
  {
    id: "perth-broad-professionals-mixer",
    name: "Perth Broad Professionals Mixer",
    date: "2026-06-25T18:30:00+08:00",
    country: "Australia",
    city: "Perth",
    location: "Leederville, Perth",
    organizer: makeOrganizer(
      "Perth Young Professionals",
      "Community",
      "Alumni-led community",
      1,
      ["Local network"],
    ),
    type: "Meetup",
    industry: ["Marketing", "Business Operations"],
    roleRelevance: ["Marketing Associate", "Growth Associate", "Operations Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 1,
    tags: ["Social only", "Broad audience", "Low recruiter presence"],
    summary: "A pleasant general networking room, but low on dependable recruiter or employer signals.",
    whyItMatters: "Netly should visibly demote rooms like this so users stop treating every networking opportunity as equally valuable.",
  },
  {
    id: "new-york-fintech-founders-exchange",
    name: "New York Fintech Founders Exchange",
    date: "2026-05-14T18:30:00-04:00",
    country: "United States",
    city: "New York",
    location: "Flatiron, New York",
    organizer: makeOrganizer(
      "American Express Career Lab",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Hiring managers", "Recruiter-visible"],
    ),
    type: "Meetup",
    industry: ["Fintech", "Product"],
    roleRelevance: ["Strategy Analyst", "Product Analyst", "Operations Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 5,
    tags: ["Hiring pipeline", "Easy referral", "Operator-heavy"],
    summary: "A curated operator room with live fintech hiring context and very strong warm-intro potential.",
    whyItMatters: "This is exactly the kind of room Netly is built to surface: specific, credible, and close to real team demand.",
  },
  {
    id: "new-york-strategy-careers-night",
    name: "New York Strategy Careers Night",
    date: "2026-05-29T18:00:00-04:00",
    country: "United States",
    city: "New York",
    location: "Midtown, New York",
    organizer: makeOrganizer(
      "Columbia Business Career Community",
      "University",
      "Top university-backed",
      3,
      ["Top university", "High alumni density", "Employer booths"],
    ),
    type: "Info Session",
    industry: ["Consulting", "Finance"],
    roleRelevance: ["Business Analyst", "Associate Consultant", "Finance Analyst"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 4,
    tags: ["Top university", "High alumni density", "Recruiter-visible"],
    summary: "A high-credibility careers night that mixes school brand, alumni access, and structured employer conversations.",
    whyItMatters: "This room is stronger than a broad career fair because the school brand and alumni density increase follow-up quality.",
  },
  {
    id: "nyc-venture-community-social",
    name: "NYC Venture Community Social",
    date: "2026-06-12T18:30:00-04:00",
    country: "United States",
    city: "New York",
    location: "SoHo, New York",
    organizer: makeOrganizer(
      "NY Venture Friends",
      "Community",
      "Alumni-led community",
      2,
      ["Founder access", "Local network"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Partnerships / BD"],
    roleRelevance: ["Founder Associate", "Business Development Associate", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Investor-heavy", "Social only"],
    summary: "Good for ecosystem awareness, but the room is noisier than users usually expect from the title.",
    whyItMatters: "Useful after you already know who you want to find, but weak as a first move for students looking for hiring signal.",
  },
  {
    id: "san-francisco-product-leadership-office-hours",
    name: "San Francisco Product Leadership Office Hours",
    date: "2026-05-20T18:00:00-07:00",
    country: "United States",
    city: "San Francisco",
    location: "Mission Bay, San Francisco",
    organizer: makeOrganizer(
      "Google Careers Bay Area",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "FAANG-adjacent", "Recruiter-visible"],
    ),
    type: "Panel",
    industry: ["Product", "Technology"],
    roleRelevance: ["Product Analyst", "Product Manager", "Operations Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 5,
    tags: ["Hiring pipeline", "Recruiter-visible", "Operator-heavy"],
    summary: "A top-tier product room where operator access and company credit are both unusually strong.",
    whyItMatters: "This is the kind of event where the host brand itself materially changes the room quality and follow-up odds.",
  },
  {
    id: "bay-area-ai-talent-forum",
    name: "Bay Area AI Talent Forum",
    date: "2026-06-02T18:30:00-07:00",
    country: "United States",
    city: "San Francisco",
    location: "SoMa, San Francisco",
    organizer: makeOrganizer(
      "Stanford AI Career Collective",
      "University",
      "Top university-backed",
      3,
      ["Top university", "High alumni density", "Recruiter-visible"],
    ),
    type: "Conference",
    industry: ["Technology", "Product"],
    roleRelevance: ["Product Analyst", "Program Manager", "Operations Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Top university", "Technical depth", "Hiring pipeline"],
    summary: "A credible AI room that is strongest for students who want product and program roles near technical teams.",
    whyItMatters: "The university signal makes the room more curated, but the best outcomes still come from knowing which teams are actually hiring.",
  },
  {
    id: "sf-founder-happy-hour",
    name: "SF Founder Happy Hour",
    date: "2026-06-17T18:30:00-07:00",
    country: "United States",
    city: "San Francisco",
    location: "Dogpatch, San Francisco",
    organizer: makeOrganizer(
      "Founders Signal SF",
      "Startup",
      "Startup / founder-led",
      2,
      ["Founder access", "Startup operators"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Product"],
    roleRelevance: ["Founder Associate", "Product Analyst", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Broad audience", "Social only"],
    summary: "High founder density, low predictability. Strong for confident operators, weaker for users who need structure.",
    whyItMatters: "Netly should show users that founder access alone does not automatically mean a room is high ROI.",
  },
  {
    id: "chicago-women-in-consulting-panel",
    name: "Chicago Women in Consulting Panel",
    date: "2026-05-22T18:00:00-05:00",
    country: "United States",
    city: "Chicago",
    location: "The Loop, Chicago",
    organizer: makeOrganizer(
      "Midwest Consulting Network",
      "Association",
      "Major industry association",
      2,
      ["High alumni density", "Major association"],
    ),
    type: "Panel",
    industry: ["Consulting"],
    roleRelevance: ["Business Analyst", "Associate Consultant", "Strategy Analyst"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 4,
    tags: ["High alumni density", "Student-friendly", "Easy referral"],
    summary: "A strong insight-heavy consulting panel with better referral potential than its polished format first suggests.",
    whyItMatters: "Panels like this are useful when Netly can explain who in the room is actually worth following up with afterward.",
  },
  {
    id: "chicago-corporate-strategy-network",
    name: "Chicago Corporate Strategy Network",
    date: "2026-06-04T18:15:00-05:00",
    country: "United States",
    city: "Chicago",
    location: "River North, Chicago",
    organizer: makeOrganizer(
      "United Airlines Early Careers",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Hiring managers", "Recruiter-visible"],
    ),
    type: "Meetup",
    industry: ["Business Operations", "Finance"],
    roleRelevance: ["Strategy Analyst", "Finance Analyst", "Operations Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Hiring pipeline", "Operator-heavy", "Recruiter-visible"],
    summary: "A practical corporate strategy room where big-company visibility and operator access both matter.",
    whyItMatters: "This is the kind of event that helps students compare brand value with actual role relevance instead of guessing.",
  },
  {
    id: "chicago-tech-community-mixer",
    name: "Chicago Tech Community Mixer",
    date: "2026-06-19T18:30:00-05:00",
    country: "United States",
    city: "Chicago",
    location: "Fulton Market, Chicago",
    organizer: makeOrganizer(
      "Built in Midwest",
      "Community",
      "Alumni-led community",
      2,
      ["Local network", "Community host"],
    ),
    type: "Meetup",
    industry: ["Technology", "Marketing"],
    roleRelevance: ["Product Analyst", "Growth Associate", "Marketing Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Broad audience", "Social only", "Community host"],
    summary: "A solid local room for awareness, but not strong enough to rank high for direct recruiting outcomes.",
    whyItMatters: "Useful as a discovery room, but it should not outrank more focused employer or association-led events.",
  },
  {
    id: "austin-product-growth-builder-forum",
    name: "Austin Product & Growth Builder Forum",
    date: "2026-05-27T18:30:00-05:00",
    country: "United States",
    city: "Austin",
    location: "East Austin, Austin",
    organizer: makeOrganizer(
      "Indeed Product Community",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Operator-heavy", "Hiring managers"],
    ),
    type: "Meetup",
    industry: ["Product", "Marketing"],
    roleRelevance: ["Product Analyst", "Growth Associate", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Hiring pipeline", "Easy referral"],
    summary: "A product-growth room with unusually practical conversations about hiring relevance and execution work.",
    whyItMatters: "It gives students a clearer path into product-adjacent roles than broad tech socials usually do.",
  },
  {
    id: "austin-startup-talent-showcase",
    name: "Austin Startup Talent Showcase",
    date: "2026-06-09T18:15:00-05:00",
    country: "United States",
    city: "Austin",
    location: "Downtown Austin",
    organizer: makeOrganizer(
      "Capital Factory Talent Studio",
      "Startup",
      "Startup / founder-led",
      2,
      ["Founder access", "Startup operators", "Recruiter-visible"],
    ),
    type: "Pitch Night",
    industry: ["VC / Startups", "Product"],
    roleRelevance: ["Founder Associate", "Business Development Associate", "Product Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Founder access", "Hiring pipeline", "Investor-heavy"],
    summary: "Stronger than a normal startup social because the room includes some structured talent visibility.",
    whyItMatters: "Still noisy, but this one can become worthwhile when the user is explicitly targeting startups rather than big firms.",
  },
  {
    id: "austin-general-tech-happy-hour",
    name: "Austin General Tech Happy Hour",
    date: "2026-06-23T18:30:00-05:00",
    country: "United States",
    city: "Austin",
    location: "South Congress, Austin",
    organizer: makeOrganizer(
      "Austin Newcomers Tech Club",
      "Community",
      "Alumni-led community",
      1,
      ["Local network"],
    ),
    type: "Meetup",
    industry: ["Technology"],
    roleRelevance: ["Product Analyst", "Growth Associate", "Marketing Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 1,
    tags: ["Social only", "Broad audience", "Low recruiter presence"],
    summary: "A broad local social that feels useful emotionally, but rarely creates a high-confidence next step.",
    whyItMatters: "This is exactly the kind of room students often overvalue before they learn how to judge signal quality.",
  },
  {
    id: "london-early-career-operator-forum",
    name: "London Early-Career Operator Forum",
    date: "2026-05-28T18:00:00+01:00",
    country: "United Kingdom",
    city: "London",
    location: "Shoreditch, London",
    organizer: makeOrganizer(
      "Operator Network UK",
      "Association",
      "Major industry association",
      3,
      ["Major association", "Recruiter-visible", "High alumni density"],
    ),
    type: "Conference",
    industry: ["Consulting", "Product"],
    roleRelevance: ["Strategy Analyst", "Business Analyst", "Product Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 5,
    tags: ["Hiring pipeline", "High alumni density", "Recruiter-visible"],
    summary: "One of the strongest London rooms for early-career operators because the signal is both broad and credible.",
    whyItMatters: "This room makes the product story obvious: students do not need more events, they need help spotting rooms like this one.",
  },
  {
    id: "london-consulting-talent-session",
    name: "London Consulting Talent Session",
    date: "2026-06-10T18:00:00+01:00",
    country: "United Kingdom",
    city: "London",
    location: "Canary Wharf, London",
    organizer: makeOrganizer(
      "Imperial Careers & Consulting Club",
      "University",
      "Top university-backed",
      3,
      ["Top university", "Employer booths", "High alumni density"],
    ),
    type: "Info Session",
    industry: ["Consulting", "Finance"],
    roleRelevance: ["Associate Consultant", "Business Analyst", "Finance Analyst"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 4,
    tags: ["Top university", "Recruiter-visible", "Student-friendly"],
    summary: "A polished consulting room where school brand and employer visibility combine into a high-trust setting.",
    whyItMatters: "The event matters less because it is glamorous and more because it lowers the cost of meeting the right people quickly.",
  },
  {
    id: "london-startups-after-hours",
    name: "London Startups After Hours",
    date: "2026-06-24T18:30:00+01:00",
    country: "United Kingdom",
    city: "London",
    location: "Old Street, London",
    organizer: makeOrganizer(
      "London Founders Circle",
      "Startup",
      "Startup / founder-led",
      2,
      ["Founder access", "Startup operators"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Partnerships / BD"],
    roleRelevance: ["Founder Associate", "Business Development Associate", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Broad audience", "Social only"],
    summary: "Energetic and useful for context, but not a reliable first move if the user needs structured hiring signal.",
    whyItMatters: "This should rank below more curated rooms even though the startup branding feels exciting on the surface.",
  },
  {
    id: "manchester-digital-ops-meetup",
    name: "Manchester Digital Ops Meetup",
    date: "2026-05-21T18:30:00+01:00",
    country: "United Kingdom",
    city: "Manchester",
    location: "Northern Quarter, Manchester",
    organizer: makeOrganizer(
      "Manchester Digital",
      "Association",
      "Major industry association",
      2,
      ["Major association", "Operator-heavy"],
    ),
    type: "Meetup",
    industry: ["Business Operations", "Technology"],
    roleRelevance: ["Operations Analyst", "Program Manager", "Product Analyst"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Easy referral", "Targeted audience"],
    summary: "A focused regional room with better operator density than the title might suggest.",
    whyItMatters: "This is useful for demonstrating that smaller-city rooms can still score well when the audience is well matched.",
  },
  {
    id: "manchester-business-strategy-breakfast",
    name: "Manchester Business Strategy Breakfast",
    date: "2026-06-05T08:15:00+01:00",
    country: "United Kingdom",
    city: "Manchester",
    location: "Spinningfields, Manchester",
    organizer: makeOrganizer(
      "North West Business Council",
      "Association",
      "Major industry association",
      2,
      ["Major association", "Local employers"],
    ),
    type: "Panel",
    industry: ["Consulting", "Business Operations"],
    roleRelevance: ["Strategy Analyst", "Business Analyst", "Program Manager"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Targeted audience", "Easy referral", "Local employers"],
    summary: "Good for insight and warm introductions, but not as direct as employer-led recruiting rooms.",
    whyItMatters: "This is the sort of medium-signal event Netly should position as useful, but not automatically first-priority.",
  },
  {
    id: "manchester-general-tech-social",
    name: "Manchester General Tech Social",
    date: "2026-06-20T18:30:00+01:00",
    country: "United Kingdom",
    city: "Manchester",
    location: "Ancoats, Manchester",
    organizer: makeOrganizer(
      "North Tech Friends",
      "Community",
      "Alumni-led community",
      1,
      ["Local network"],
    ),
    type: "Meetup",
    industry: ["Technology"],
    roleRelevance: ["Product Analyst", "Growth Associate", "Marketing Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Social only", "Broad audience", "Community host"],
    summary: "A friendly room with community value, but limited reason to rank it above more targeted options.",
    whyItMatters: "It demonstrates that community familiarity and actual hiring usefulness are not the same thing.",
  },
  {
    id: "edinburgh-finance-careers-night",
    name: "Edinburgh Finance Careers Night",
    date: "2026-05-26T18:00:00+01:00",
    country: "United Kingdom",
    city: "Edinburgh",
    location: "Old Town, Edinburgh",
    organizer: makeOrganizer(
      "University of Edinburgh Careers",
      "University",
      "Top university-backed",
      3,
      ["Top university", "Employer booths", "High alumni density"],
    ),
    type: "Info Session",
    industry: ["Finance"],
    roleRelevance: ["Finance Analyst", "Investment Analyst", "Business Analyst"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 4,
    tags: ["Top university", "Recruiter-visible", "Hiring pipeline"],
    summary: "A structured finance room with enough school and employer credit to make follow-up meaningful.",
    whyItMatters: "This is a clear example of how school brand and employer access can increase room quality without needing a flashy format.",
  },
  {
    id: "edinburgh-policy-innovation-forum",
    name: "Edinburgh Policy & Innovation Forum",
    date: "2026-06-12T18:00:00+01:00",
    country: "United Kingdom",
    city: "Edinburgh",
    location: "New Town, Edinburgh",
    organizer: makeOrganizer(
      "Scottish Futures Forum",
      "Association",
      "Major industry association",
      2,
      ["Major association", "Policy leaders"],
    ),
    type: "Panel",
    industry: ["Policy / Public Sector", "Business Operations"],
    roleRelevance: ["Program Manager", "Strategy Analyst", "Operations Analyst"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Targeted audience", "High alumni density", "Thought-leadership heavy"],
    summary: "A thoughtful room with good policy relevance, but more insight-heavy than recruiter-heavy.",
    whyItMatters: "This helps show that strong topical relevance does not always equal immediate hiring momentum.",
  },
  {
    id: "edinburgh-startup-community-social",
    name: "Edinburgh Startup Community Social",
    date: "2026-06-26T18:30:00+01:00",
    country: "United Kingdom",
    city: "Edinburgh",
    location: "Leith, Edinburgh",
    organizer: makeOrganizer(
      "Startup Scotland Community",
      "Community",
      "Alumni-led community",
      1,
      ["Founder access", "Local network"],
    ),
    type: "Meetup",
    industry: ["VC / Startups"],
    roleRelevance: ["Founder Associate", "Partnerships Associate", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Founder access", "Social only", "Broad audience"],
    summary: "Better for ecosystem familiarity than structured job outcomes.",
    whyItMatters: "A useful reminder that startup community energy and actual recruiting value are different product signals.",
  },
  {
    id: "toronto-growth-product-meetup",
    name: "Toronto Growth Product Meetup",
    date: "2026-06-04T18:30:00-04:00",
    country: "Canada",
    city: "Toronto",
    location: "King West, Toronto",
    organizer: makeOrganizer(
      "Product North",
      "Association",
      "Major industry association",
      3,
      ["Operator-heavy", "Easy referral", "Major association"],
    ),
    type: "Meetup",
    industry: ["Product", "Technology"],
    roleRelevance: ["Product Analyst", "Product Manager", "Growth Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 5,
    tags: ["Operator-heavy", "Easy referral", "Hiring pipeline"],
    summary: "A practical product room with the right mix of operators, community trust, and warm-intro potential.",
    whyItMatters: "This is the type of event where Netly can justify a strong recommendation with both room quality and clear next-step logic.",
  },
  {
    id: "toronto-consulting-finance-careers-forum",
    name: "Toronto Consulting & Finance Careers Forum",
    date: "2026-06-16T17:45:00-04:00",
    country: "Canada",
    city: "Toronto",
    location: "Downtown Toronto",
    organizer: makeOrganizer(
      "Rotman Career Centre",
      "University",
      "Top university-backed",
      3,
      ["Top university", "Employer booths", "High alumni density"],
    ),
    type: "Conference",
    industry: ["Consulting", "Finance"],
    roleRelevance: ["Business Analyst", "Associate Consultant", "Finance Analyst"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 4,
    tags: ["Top university", "Recruiter-visible", "Student-friendly"],
    summary: "A school-backed employer forum with broad brand credibility and strong early-career relevance.",
    whyItMatters: "This is the kind of room where education signal, host reputation, and employer presence all reinforce one another.",
  },
  {
    id: "toronto-founder-demo-night",
    name: "Toronto Founder Demo Night",
    date: "2026-06-25T18:30:00-04:00",
    country: "Canada",
    city: "Toronto",
    location: "Liberty Village, Toronto",
    organizer: makeOrganizer(
      "MaRS Startup Community",
      "Startup",
      "Startup / founder-led",
      2,
      ["Founder access", "Startup operators", "Investor-heavy"],
    ),
    type: "Pitch Night",
    industry: ["VC / Startups", "Partnerships / BD"],
    roleRelevance: ["Founder Associate", "Business Development Associate", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Founder access", "Investor-heavy", "Hiring pipeline"],
    summary: "A better-than-average startup showcase because it blends demos with some structured follow-up opportunities.",
    whyItMatters: "Still noisier than employer-backed rooms, but useful when the user explicitly wants startup-facing roles.",
  },
  {
    id: "vancouver-brand-builders-breakfast",
    name: "Vancouver Brand Builders Breakfast",
    date: "2026-05-26T08:30:00-07:00",
    country: "Canada",
    city: "Vancouver",
    location: "Gastown, Vancouver",
    organizer: makeOrganizer(
      "Northwest Growth Club",
      "Community",
      "Alumni-led community",
      2,
      ["Local network", "Operator-heavy"],
    ),
    type: "Meetup",
    industry: ["Marketing", "Partnerships / BD"],
    roleRelevance: ["Marketing Associate", "Growth Associate", "Partnerships Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Operator-heavy", "Easy referral", "Targeted audience"],
    summary: "A focused breakfast room where the crowd is small enough for real conversations and practical follow-ups.",
    whyItMatters: "This demonstrates that a community-led room can still be high quality when the audience fit is tight and repeat attendance matters.",
  },
  {
    id: "vancouver-product-partnerships-salon",
    name: "Vancouver Product & Partnerships Salon",
    date: "2026-06-11T18:00:00-07:00",
    country: "Canada",
    city: "Vancouver",
    location: "Yaletown, Vancouver",
    organizer: makeOrganizer(
      "Amazon Community West",
      "Employer",
      "Fortune 500-backed",
      3,
      ["Fortune 500", "Hiring managers", "Operator-heavy"],
    ),
    type: "Panel",
    industry: ["Product", "Partnerships / BD"],
    roleRelevance: ["Product Analyst", "Partnerships Associate", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 3,
    tags: ["Operator-heavy", "Recruiter-visible", "Easy referral"],
    summary: "A useful bridge room for product-adjacent and partnership roles, though narrower than a general product meetup.",
    whyItMatters: "This is a good example of a role-specific room that becomes valuable once Netly helps the user self-segment correctly.",
  },
  {
    id: "vancouver-creative-tech-mixer",
    name: "Vancouver Creative Tech Mixer",
    date: "2026-06-26T18:30:00-07:00",
    country: "Canada",
    city: "Vancouver",
    location: "Mount Pleasant, Vancouver",
    organizer: makeOrganizer(
      "Pacific Creative Tech Club",
      "Community",
      "Alumni-led community",
      1,
      ["Local network"],
    ),
    type: "Meetup",
    industry: ["Technology", "Marketing"],
    roleRelevance: ["Product Analyst", "Marketing Associate", "Growth Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 2,
    tags: ["Broad audience", "Social only", "Community host"],
    summary: "Fun and well-attended, but too broad to be a reliable first stop for targeted networking.",
    whyItMatters: "This is the kind of event students often enjoy but should not confuse with a room that has clear recruiting value.",
  },
  {
    id: "montreal-fintech-policy-summit",
    name: "Montreal Fintech & Policy Summit",
    date: "2026-05-29T18:00:00-04:00",
    country: "Canada",
    city: "Montreal",
    location: "Ville-Marie, Montreal",
    organizer: makeOrganizer(
      "Finance Montreal",
      "Association",
      "Major industry association",
      3,
      ["Major association", "Finance employers", "Recruiter-visible"],
    ),
    type: "Conference",
    industry: ["Fintech", "Policy / Public Sector"],
    roleRelevance: ["Strategy Analyst", "Finance Analyst", "Program Manager"],
    careerStage: ["Student", "Fresh Grad", "1-3 Years"],
    roiScore: 4,
    tags: ["Hiring pipeline", "Targeted audience", "Major association"],
    summary: "A high-context room that is especially useful for users balancing commercial and public-interest pathways.",
    whyItMatters: "It shows that strong organizer credit can make even a niche room very worthwhile when the user profile matches.",
  },
  {
    id: "montreal-university-industry-connect",
    name: "Montreal University Industry Connect",
    date: "2026-06-13T17:30:00-04:00",
    country: "Canada",
    city: "Montreal",
    location: "Downtown Montreal",
    organizer: makeOrganizer(
      "McGill Careers Network",
      "University",
      "Top university-backed",
      3,
      ["Top university", "High alumni density", "Employer booths"],
    ),
    type: "Info Session",
    industry: ["Technology", "Business Operations"],
    roleRelevance: ["Business Analyst", "Product Analyst", "Program Manager"],
    careerStage: ["Student", "Fresh Grad"],
    roiScore: 3,
    tags: ["Top university", "Student-friendly", "Recruiter-visible"],
    summary: "Broad but credible, with enough school signal to make the room still worth attending for many users.",
    whyItMatters: "Not every school-backed room is elite, but this one does a decent job of reducing search friction for early-career candidates.",
  },
  {
    id: "montreal-startup-community-happy-hour",
    name: "Montreal Startup Community Happy Hour",
    date: "2026-06-27T18:30:00-04:00",
    country: "Canada",
    city: "Montreal",
    location: "Plateau-Mont-Royal, Montreal",
    organizer: makeOrganizer(
      "Montreal Founder Fridays",
      "Community",
      "Alumni-led community",
      1,
      ["Founder access", "Local network"],
    ),
    type: "Meetup",
    industry: ["VC / Startups", "Marketing"],
    roleRelevance: ["Founder Associate", "Growth Associate", "Business Development Associate"],
    careerStage: ["Fresh Grad", "1-3 Years"],
    roiScore: 1,
    tags: ["Social only", "Founder access", "Broad audience"],
    summary: "Warm and social, but not a dependable room for structured career momentum.",
    whyItMatters: "This event exists to make the low-signal end of the ranking visually obvious in the demo.",
  },
];

export const events: Event[] = eventSeeds
  .map((seed) => ({
    ...seed,
    communicationSkill: buildCommunicationRequirement(seed),
    roiBreakdown: buildRoiBreakdown(seed),
    targets: buildTargets(seed),
    playbook: buildPlaybook(seed),
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const comparisonRows = [
  { label: "Event discovery", linkedin: "Yes", meetup: "Yes", netly: "Yes" },
  { label: "Personalized recommendations", linkedin: "Yes", meetup: "No", netly: "Yes" },
  { label: "Geographic drill-down", linkedin: "Limited", meetup: "Limited", netly: "Yes" },
  { label: "ROI prediction", linkedin: "No", meetup: "No", netly: "Yes" },
  { label: "Organizer credibility layer", linkedin: "No", meetup: "No", netly: "Yes" },
  { label: "AI conversation playbook", linkedin: "No", meetup: "No", netly: "Yes" },
  { label: "Natural language → filters", linkedin: "No", meetup: "No", netly: "Yes" },
  { label: "Outcome tracking", linkedin: "No", meetup: "No", netly: "Yes" },
];

function matchesOrganizerCredibility(event: Event, value: string) {
  if (value === "All credibility levels") {
    return true;
  }

  return event.organizer.credibilityLabel === value;
}

function matchesRoiBand(event: Event, value: string) {
  if (value === "All ROI levels") {
    return true;
  }

  if (value === "High ROI") {
    return event.roiScore >= 4;
  }

  if (value === "Medium ROI") {
    return event.roiScore === 3;
  }

  return event.roiScore <= 2;
}

function matchesCommunicationSkill(event: Event, value: string) {
  if (value === "All communication levels") {
    return true;
  }

  return event.communicationSkill.level === value;
}

function matchesEmployerPreference(event: Event, value: string) {
  if (value === "Open to all") {
    return true;
  }

  if (value === "Big-name employers") {
    return (
      event.organizer.credibilityLabel === "Fortune 500-backed" ||
      event.organizer.employerSignals.some((signal) => ["Fortune 500", "Big 4", "FAANG-adjacent"].includes(signal))
    );
  }

  if (value === "Startup teams") {
    return event.organizer.type === "Startup";
  }

  if (value === "University-backed rooms") {
    return event.organizer.type === "University";
  }

  if (value === "Association-backed rooms") {
    return event.organizer.type === "Association";
  }

  return true;
}

export function filterEvents(list: Event[], filters: FilterState) {
  return list.filter((event) => {
    if (event.country !== filters.country) {
      return false;
    }

    if (filters.city !== "All cities" && event.city !== filters.city) {
      return false;
    }

    if (filters.industry !== "All industries" && !event.industry.includes(filters.industry)) {
      return false;
    }

    if (filters.role !== "All roles" && !event.roleRelevance.includes(filters.role)) {
      return false;
    }

    if (filters.careerStage !== "All stages" && !event.careerStage.includes(filters.careerStage as CareerStage)) {
      return false;
    }

    if (filters.eventType !== "All event types" && event.type !== filters.eventType) {
      return false;
    }

    if (!matchesOrganizerCredibility(event, filters.organizerCredibility)) {
      return false;
    }

    if (!matchesRoiBand(event, filters.roiBand)) {
      return false;
    }

    if (!matchesCommunicationSkill(event, filters.communicationSkill)) {
      return false;
    }

    return true;
  });
}

export function scoreEventAgainstProfile(event: Event, profile: ProfileInterpretation) {
  let score = event.roiScore * 12 + event.organizer.credibilityTier * 5;

  if (event.country === profile.country) {
    score += 18;
  }

  if (profile.city !== "All cities" && event.city === profile.city) {
    score += 12;
  }

  if (profile.preferredCities.includes(event.city)) {
    score += 10;
  }

  if (profile.industry !== "All industries" && event.industry.includes(profile.industry)) {
    score += 14;
  }

  if (profile.role !== "All roles" && event.roleRelevance.includes(profile.role)) {
    score += 16;
  }

  if (profile.careerStage !== "All stages" && event.careerStage.includes(profile.careerStage as CareerStage)) {
    score += 8;
  }

  if (matchesOrganizerCredibility(event, profile.organizerCredibility)) {
    score += 6;
  }

  if (matchesEmployerPreference(event, profile.employerPreference)) {
    score += 6;
  }

  if (profile.roiBand === "High ROI" && event.roiScore >= 4) {
    score += 5;
  }

  if (matchesCommunicationSkill(event, profile.communicationSkill)) {
    score += 4;
  }

  if (event.tags.some((tag) => tag.toLowerCase().includes("social only"))) {
    score -= 8;
  }

  return score;
}

export function getRecommendedEvents(profile: ProfileInterpretation, limit = 3) {
  const strictMatches = events.filter((event) => {
    if (event.country !== profile.country) {
      return false;
    }

    if (profile.preferredCities.length > 1 && !profile.preferredCities.includes(event.city)) {
      return false;
    }

    if (profile.city !== "All cities" && event.city !== profile.city) {
      return false;
    }

    if (profile.industry !== "All industries" && !event.industry.includes(profile.industry)) {
      return false;
    }

	    if (profile.role !== "All roles" && !event.roleRelevance.includes(profile.role)) {
	      return false;
	    }

    if (!matchesCommunicationSkill(event, profile.communicationSkill)) {
      return false;
    }

	    return true;
	  });

  const pool = strictMatches.length >= limit ? strictMatches : events.filter((event) => event.country === profile.country);

  return [...pool]
    .sort((left, right) => scoreEventAgainstProfile(right, profile) - scoreEventAgainstProfile(left, profile))
    .slice(0, limit);
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}
