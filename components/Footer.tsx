import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(6,14,24,0.92)]">
      <div className="section-shell py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">Netly</p>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              Built as an AI-powered demo for [course name]. Netly reframes networking from event discovery
              to market-aware decision making.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <Link href="/events" className="transition-colors hover:text-white">Events</Link>
            <Link href="/strategy" className="transition-colors hover:text-white">My Strategy</Link>
            <Link href="/about" className="transition-colors hover:text-white">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
