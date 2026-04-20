"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DemoUser = {
  name: string;
  email: string;
  persona: string;
};

const storageKey = "netly-demo-user";

function readDemoUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(storageKey);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as DemoUser;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function FakeAuthButton() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    function syncUser() {
      setUser(readDemoUser());
    }

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("netly-auth-updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("netly-auth-updated", syncUser);
    };
  }, []);

  if (!user) {
    return (
      <Button asChild size="sm" variant="secondary">
        <Link href="/login">
          <UserRound className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur md:flex">
      <UserRound className="h-4 w-4 text-emerald-200" />
      <span className="max-w-[120px] truncate">{user.name}</span>
      <button
        type="button"
        onClick={() => {
          window.localStorage.removeItem(storageKey);
          window.dispatchEvent(new Event("netly-auth-updated"));
        }}
        className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Log out of demo account"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

