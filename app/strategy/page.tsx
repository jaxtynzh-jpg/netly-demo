import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { StrategyForm } from "@/components/StrategyForm";

export const metadata: Metadata = {
  title: "My Strategy | Netly",
  description: "Turn a natural-language profile into filters, AI-ranked events, and a networking playbook.",
};

export default function StrategyPage() {
  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="My Strategy"
          title="Let Netly translate your profile into a networking plan"
          description="This page is the clearest demo of the product idea: a student can either use structured filters or describe their situation naturally, and Netly turns that into an AI-powered ranked event strategy."
          tone="inverse"
        />

        <div className="mt-10">
          <StrategyForm />
        </div>
      </section>
    </div>
  );
}
