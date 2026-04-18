import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About | Netly",
  description: "Why the Netly demo exists, what changed in V2, and how the methodology is framed.",
};

const teamMembers = [
  {
    name: "Your Name",
    role: "Product demo lead",
    description: "Responsible for presenting the user flow, filter logic, event detail experience, and the natural-language demo.",
  },
  {
    name: "Teammate Name",
    role: "Research and narrative lead",
    description: "Responsible for the market gap, opportunity framing, and why Netly is a decision layer rather than a generic event list.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="About Netly"
          title="Why we built this demo"
          description="Netly exists because students do not just struggle to find networking events. They struggle to judge which rooms are credible, market-relevant, and genuinely worth spending time on."
          tone="inverse"
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200/80 bg-white">
            <CardContent className="space-y-5 pt-6 text-base leading-8 text-slate-600">
              <p>
                In the current hiring environment, resume screening is efficient but imperfect. It can spot
                keywords and surface-level matching, but it often struggles to capture real team fit, soft
                skills, and judgment. That makes networking unusually valuable for early-career candidates,
                because it gives both sides a chance to assess each other more directly.
              </p>
              <p>
                The harder problem is that the event landscape is fragmented and noisy. Students can find rooms,
                but they usually do not know which ones are genuinely worth attending. Netly is designed as a
                decision layer: rank the room, show why the organizer matters, and give the user a practical
                playbook instead of just a list.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-slate-950">Methodology</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The V2 demo combines curated event metadata, organizer credibility signals, and mock LLM-style
                profile interpretation to showcase how Netly could feel as a product.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                    What is real in the demo
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    The interface, filters, country/city drill-down, role taxonomy, organizer credit layer, and
                    event-ranking logic are all implemented against static mock data.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                    What is mocked
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    The natural-language assistant is demo-only. There are no real LLM calls, no live event
                    sources, and no persistent user accounts.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Long-term moat
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    The longer-term defensibility is the event → referral / interview / job outcome loop. Even in
                    the demo, the feedback buttons hint at how Netly could eventually learn which rooms actually work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-20">
        <SectionHeading
          eyebrow="Team"
          title="Presentation-friendly placeholders"
          description="These remain easy to swap, but the layout now supports a more product-led presentation story."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.name} className="border-slate-200/80 bg-white">
              <CardContent className="pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-lg font-semibold text-emerald-700">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{member.name}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-slate-400">
                  {member.role}
                </p>
                <p className="mt-4 text-base leading-7 text-slate-600">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
