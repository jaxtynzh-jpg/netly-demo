import type { Metadata } from "next";
import { EventsExplorer } from "@/components/EventsExplorer";

export const metadata: Metadata = {
  title: "Events | Netly",
  description: "Browse AI-ranked networking events by country, city, role, and organizer credibility.",
};

export default function EventsPage() {
  return <EventsExplorer />;
}
