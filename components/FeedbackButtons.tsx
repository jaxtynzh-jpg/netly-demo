"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const outcomes = ["Got a referral", "Got an interview"] as const;

export function FeedbackButtons() {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(value: string) {
    setSelected(value);
    toast.success("Thanks for your feedback! This helps us improve scoring.");
  }

  return (
    <div className="flex flex-wrap gap-3">
      {outcomes.map((outcome) => (
        <Button
          key={outcome}
          type="button"
          variant={selected === outcome ? "default" : "secondary"}
          onClick={() => handleSelect(outcome)}
        >
          {outcome}
        </Button>
      ))}
    </div>
  );
}
