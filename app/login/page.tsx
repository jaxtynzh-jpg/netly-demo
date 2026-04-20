import type { Metadata } from "next";
import { FakeLoginForm } from "@/components/FakeLoginForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Login | Netly",
  description: "Fake login flow for the Netly demo.",
};

export default function LoginPage() {
  return (
    <div className="pb-24">
      <section className="section-shell pt-14 sm:pt-20">
        <SectionHeading
          eyebrow="Login"
          title="A lightweight fake account flow for the demo"
          description="Use any details. This exists only to make the prototype feel like a real product without adding authentication or a backend."
          tone="inverse"
        />

        <div className="mt-10">
          <FakeLoginForm />
        </div>
      </section>
    </div>
  );
}

