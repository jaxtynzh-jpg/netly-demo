"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const storageKey = "netly-demo-user";

export function FakeLoginForm() {
  const router = useRouter();
  const [name, setName] = useState("Jax Chen");
  const [email, setEmail] = useState("student@demo.com");
  const [persona, setPersona] = useState("Fresh grad");

  return (
    <Card className="mx-auto max-w-2xl border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.96),rgba(255,255,255,0.95))]">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Demo Login
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Create a fake Netly account
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This does not connect to a backend. It only saves a demo profile in this browser so the presentation can show a login state.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
            <UserRound className="h-5 w-5" />
          </div>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            window.localStorage.setItem(
              storageKey,
              JSON.stringify({
                name: name.trim() || "Demo Student",
                email: email.trim() || "student@demo.com",
                persona,
              }),
            );
            window.dispatchEvent(new Event("netly-auth-updated"));
            router.push("/strategy");
          }}
        >
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Career stage
            <select
              value={persona}
              onChange={(event) => setPersona(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80"
            >
              <option>Student</option>
              <option>Fresh grad</option>
              <option>1-3 years experience</option>
            </select>
          </label>

          <div className="pt-2">
            <Button type="submit">
              <Sparkles className="mr-2 h-4 w-4" />
              Enter Demo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

