import { Badge } from "@/components/ui/badge";

type TagProps = {
  label: string;
};

function resolveVariant(label: string): "default" | "neutral" | "warm" | "info" | "muted" {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("hiring") ||
    normalized.includes("pipeline") ||
    normalized.includes("operator-heavy") ||
    normalized.includes("targeted")
  ) {
    return "default";
  }

  if (
    normalized.includes("hr") ||
    normalized.includes("recruiter") ||
    normalized.includes("top university") ||
    normalized.includes("technical")
  ) {
    return "info";
  }

  if (
    normalized.includes("referral") ||
    normalized.includes("alumni") ||
    normalized.includes("fortune 500") ||
    normalized.includes("big 4") ||
    normalized.includes("founder")
  ) {
    return "warm";
  }

  if (normalized.includes("social") || normalized.includes("broad audience") || normalized.includes("low")) {
    return "muted";
  }

  return "neutral";
}

export function Tag({ label }: TagProps) {
  return <Badge variant={resolveVariant(label)}>{label}</Badge>;
}
