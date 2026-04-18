import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/events", label: "Events" },
  { href: "/strategy", label: "My Strategy" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(6,14,24,0.8)] backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1ed3a7,#0ea5e9)] text-white shadow-[0_16px_35px_-16px_rgba(30,211,167,0.7)]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base">Netly</p>
              <p className="text-sm font-normal text-slate-200">AI-powered networking intelligence</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/strategy"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "hidden md:inline-flex")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Launch AI Demo
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/strategy" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
            AI Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
