export const countries = [
  "Australia",
  "United States",
  "United Kingdom",
  "Canada",
] as const;

export type Country = (typeof countries)[number];

export const cityOptionsByCountry: Record<Country, string[]> = {
  Australia: ["All cities", "Sydney", "Melbourne", "Brisbane", "Perth"],
  "United States": ["All cities", "New York", "San Francisco", "Chicago", "Austin"],
  "United Kingdom": ["All cities", "London", "Manchester", "Edinburgh"],
  Canada: ["All cities", "Toronto", "Vancouver", "Montreal"],
};

export const industryOptions = [
  "All industries",
  "Consulting",
  "Fintech",
  "Technology",
  "Marketing",
  "Finance",
  "VC / Startups",
  "Business Operations",
  "Product",
  "Partnerships / BD",
  "Policy / Public Sector",
] as const;

export const roleOptions = [
  "All roles",
  "Business Analyst",
  "Strategy Analyst",
  "Associate Consultant",
  "Product Analyst",
  "Product Manager",
  "Operations Analyst",
  "Program Manager",
  "Marketing Associate",
  "Growth Associate",
  "Business Development Associate",
  "Partnerships Associate",
  "Finance Analyst",
  "Investment Analyst",
  "Founder Associate",
] as const;

export const careerStageOptions = [
  "All stages",
  "Student",
  "Fresh Grad",
  "1-3 Years",
] as const;

export const eventTypeOptions = [
  "All event types",
  "Meetup",
  "Info Session",
  "Pitch Night",
  "Conference",
  "Panel",
] as const;

export const organizerCredibilityOptions = [
  "All credibility levels",
  "Fortune 500-backed",
  "Top university-backed",
  "Major industry association",
  "Alumni-led community",
  "Startup / founder-led",
] as const;

export const roiBandOptions = [
  "All ROI levels",
  "High ROI",
  "Medium ROI",
  "Low ROI",
] as const;

export const communicationSkillOptions = [
  "All communication levels",
  "Low",
  "Moderate",
  "High",
  "Advanced",
] as const;

export const employerPreferenceOptions = [
  "Open to all",
  "Big-name employers",
  "Startup teams",
  "University-backed rooms",
  "Association-backed rooms",
] as const;

export type FilterState = {
  country: Country;
  city: string;
  industry: string;
  role: string;
  careerStage: string;
  eventType: string;
  organizerCredibility: string;
  roiBand: string;
  communicationSkill: string;
};

export type ProfileInterpretation = FilterState & {
  prompt: string;
  preferredCities: string[];
  employerPreference: string;
  educationSignal: string;
  summaryLines: string[];
};

export const defaultFilterState: FilterState = {
  country: "Australia",
  city: "All cities",
  industry: "All industries",
  role: "All roles",
  careerStage: "All stages",
  eventType: "All event types",
  organizerCredibility: "All credibility levels",
  roiBand: "All ROI levels",
  communicationSkill: "All communication levels",
};
