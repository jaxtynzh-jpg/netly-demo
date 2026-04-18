import {
  cityOptionsByCountry,
  defaultFilterState,
  type Country,
  type FilterState,
  type ProfileInterpretation,
} from "@/data/filters";

export const examplePrompts = [
  {
    label: "Australia consulting",
    prompt:
      "I am a fresh grad from a strong business school looking for consulting or strategy roles in Sydney or Melbourne, ideally with big-name firms.",
  },
  {
    label: "Canada product",
    prompt:
      "I studied engineering and want product or operations roles in Toronto, ideally at well-known companies with recruiter presence.",
  },
  {
    label: "UK finance",
    prompt:
      "I am a student aiming for finance or strategy jobs in London, and I prefer employer-backed or university-backed networking rooms.",
  },
  {
    label: "US startup track",
    prompt:
      "I am 1-3 years into my career and want startup-facing product or business development roles in San Francisco or Austin.",
  },
] as const;

const cityCountryMap = new Map<string, Country>([
  ["sydney", "Australia"],
  ["melbourne", "Australia"],
  ["brisbane", "Australia"],
  ["perth", "Australia"],
  ["new york", "United States"],
  ["san francisco", "United States"],
  ["chicago", "United States"],
  ["austin", "United States"],
  ["london", "United Kingdom"],
  ["manchester", "United Kingdom"],
  ["edinburgh", "United Kingdom"],
  ["toronto", "Canada"],
  ["vancouver", "Canada"],
  ["montreal", "Canada"],
]);

const industryKeywordMap = [
  { value: "Consulting", keywords: ["consulting", "consultant", "mbb", "big 4"] },
  { value: "Fintech", keywords: ["fintech", "payments", "banking tech"] },
  { value: "Technology", keywords: ["technology", "tech", "ai", "saas", "software"] },
  { value: "Marketing", keywords: ["marketing", "brand", "growth marketing"] },
  { value: "Finance", keywords: ["finance", "banking", "deals", "investment"] },
  { value: "VC / Startups", keywords: ["startup", "vc", "venture", "founder"] },
  { value: "Business Operations", keywords: ["operations", "ops", "business operations"] },
  { value: "Product", keywords: ["product", "pm", "product management"] },
  { value: "Partnerships / BD", keywords: ["partnership", "business development", "bd", "partnerships"] },
  { value: "Policy / Public Sector", keywords: ["policy", "public sector", "government"] },
] as const;

const roleKeywordMap = [
  { value: "Business Analyst", keywords: ["business analyst", "ba role", "analyst role"] },
  { value: "Strategy Analyst", keywords: ["strategy", "corporate strategy", "strategy analyst"] },
  { value: "Associate Consultant", keywords: ["consulting role", "consultant", "associate consultant"] },
  { value: "Product Analyst", keywords: ["product role", "product analyst"] },
  { value: "Product Manager", keywords: ["product manager", "pm"] },
  { value: "Operations Analyst", keywords: ["operations", "ops role", "operations analyst"] },
  { value: "Program Manager", keywords: ["program manager", "program role"] },
  { value: "Marketing Associate", keywords: ["marketing associate", "brand role"] },
  { value: "Growth Associate", keywords: ["growth", "growth role"] },
  { value: "Business Development Associate", keywords: ["business development", "bd role"] },
  { value: "Partnerships Associate", keywords: ["partnership", "partnerships"] },
  { value: "Finance Analyst", keywords: ["finance analyst", "finance role"] },
  { value: "Investment Analyst", keywords: ["investment", "deals role"] },
  { value: "Founder Associate", keywords: ["founder associate", "startup operator"] },
] as const;

function includesAny(text: string, keywords: readonly string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getCountryFromPrompt(text: string) {
  if (text.includes("united kingdom") || text.includes("uk") || text.includes("britain")) {
    return "United Kingdom" as const;
  }

  if (text.includes("united states") || text.includes("usa") || text.includes("us ")) {
    return "United States" as const;
  }

  if (text.includes("canada")) {
    return "Canada" as const;
  }

  if (text.includes("australia")) {
    return "Australia" as const;
  }

  return null;
}

function getCitiesFromPrompt(text: string) {
  return Array.from(cityCountryMap.entries())
    .filter(([city]) => text.includes(city))
    .map(([city]) => cityOptionsByCountry[cityCountryMap.get(city)!].find((option) => option.toLowerCase() === city)!)
    .filter(Boolean);
}

function getIndustryFromPrompt(text: string) {
  const match = industryKeywordMap.find((entry) => includesAny(text, entry.keywords));
  return match?.value ?? defaultFilterState.industry;
}

function getRoleFromPrompt(text: string) {
  const match = roleKeywordMap.find((entry) => includesAny(text, entry.keywords));
  return match?.value ?? defaultFilterState.role;
}

function getCareerStageFromPrompt(text: string) {
  if (includesAny(text, ["fresh grad", "recent grad", "new grad", "graduated"])) {
    return "Fresh Grad";
  }

  if (includesAny(text, ["1-3 years", "1 to 3 years", "early career", "worked for"])) {
    return "1-3 Years";
  }

  if (includesAny(text, ["student", "undergrad", "masters student", "final year"])) {
    return "Student";
  }

  return "Fresh Grad";
}

function getEducationSignalFromPrompt(text: string) {
  if (includesAny(text, ["go8", "ivy", "target school", "top university", "strong school"])) {
    return "Top-university signal";
  }

  if (includesAny(text, ["business school", "commerce", "business background", "economics"])) {
    return "Business-background signal";
  }

  if (includesAny(text, ["engineering", "computer science", "technical background", "stem"])) {
    return "Technical-background signal";
  }

  return "No explicit school signal provided";
}

function getEmployerPreferenceFromPrompt(text: string) {
  if (includesAny(text, ["big-name", "big company", "well-known", "fortune 500", "top company"])) {
    return "Big-name employers";
  }

  if (includesAny(text, ["startup", "founder-led", "early-stage"])) {
    return "Startup teams";
  }

  if (includesAny(text, ["university", "campus", "school-backed"])) {
    return "University-backed rooms";
  }

  if (includesAny(text, ["association", "professional body", "industry association"])) {
    return "Association-backed rooms";
  }

  return "Open to all";
}

function getOrganizerCredibilityFromPrompt(text: string, employerPreference: string) {
  if (includesAny(text, ["fortune 500", "big-name", "well-known", "top company"])) {
    return "Fortune 500-backed";
  }

  if (includesAny(text, ["university", "campus", "school-backed"])) {
    return "Top university-backed";
  }

  if (includesAny(text, ["association", "professional body"])) {
    return "Major industry association";
  }

  if (includesAny(text, ["alumni"])) {
    return "Alumni-led community";
  }

  if (employerPreference === "Startup teams") {
    return "Startup / founder-led";
  }

  return "All credibility levels";
}

export function createInterpretationFromFilters(
  filters: FilterState,
  prompt = "Manual filter selection",
): ProfileInterpretation {
  const preferredCities = filters.city === "All cities" ? [] : [filters.city];

  return {
    ...filters,
    prompt,
    preferredCities,
    employerPreference: "Open to all",
    educationSignal: "No explicit school signal provided",
    summaryLines: [
      `${filters.country}${filters.city !== "All cities" ? `, ${filters.city}` : " across major cities"}`,
      `${filters.industry} / ${filters.role}`,
      `${filters.careerStage}`,
      "Manual filters selected directly by the user",
    ],
  };
}

export function interpretProfilePrompt(input: string): ProfileInterpretation {
  const normalized = input.trim().toLowerCase();
  const matchedCities = getCitiesFromPrompt(normalized);
  const explicitCountry = getCountryFromPrompt(normalized);
  const cityCountry = matchedCities.length
    ? cityCountryMap.get(matchedCities[0].toLowerCase()) ?? null
    : null;
  const country = cityCountry ?? explicitCountry ?? defaultFilterState.country;
  const preferredCities = matchedCities.filter((city) => cityOptionsByCountry[country].includes(city));
  const city = preferredCities.length === 1 ? preferredCities[0] : "All cities";
  const industry = getIndustryFromPrompt(normalized);
  const role = getRoleFromPrompt(normalized);
  const careerStage = getCareerStageFromPrompt(normalized);
  const employerPreference = getEmployerPreferenceFromPrompt(normalized);
  const organizerCredibility = getOrganizerCredibilityFromPrompt(normalized, employerPreference);
  const educationSignal = getEducationSignalFromPrompt(normalized);

  return {
    country,
    city,
    industry,
    role,
    careerStage,
    eventType: defaultFilterState.eventType,
    organizerCredibility,
    roiBand: "High ROI",
    prompt: input.trim(),
    preferredCities,
    employerPreference,
    educationSignal,
    summaryLines: [
      `Focus market: ${country}${preferredCities.length ? ` (${preferredCities.join(" / ")})` : ""}`,
      `Career lane: ${industry === "All industries" ? "broad knowledge-work search" : industry} / ${
        role === "All roles" ? "broad networking roles" : role
      }`,
      `Stage and school signal: ${careerStage}, ${educationSignal}`,
      `Room preference: ${employerPreference}${
        organizerCredibility !== "All credibility levels" ? `, leaning toward ${organizerCredibility}` : ""
      }`,
    ],
  };
}

