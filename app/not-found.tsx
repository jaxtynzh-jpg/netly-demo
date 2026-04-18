import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="max-w-xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Not found</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">This event page does not exist.</h1>
        <p className="text-base leading-7 text-slate-600">
          Head back to the event list and open one of the curated demo events instead.
        </p>
        <Button asChild>
          <Link href="/events">Back to events</Link>
        </Button>
      </div>
    </div>
  );
}
