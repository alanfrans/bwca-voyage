"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/", label: "The country" },
  { href: "/day", label: "The day" },
  { href: "/body", label: "The body" },
  { href: "/hazards", label: "Hazards" },
  { href: "/journeys", label: "Journeys" },
  { href: "/engine", label: "The build" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/" className="font-display text-lg tracking-tight">
            Canoe Country
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {links.map((link) => {
              const active = link.href === "/" ? path === "/" : path.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground",
                    active && "bg-muted text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/paddle"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Paddle a day
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-12 text-sm text-muted-foreground">
        <p>
          Canoe Country is a technical design for a 3D expedition game set in the Boundary Waters
          Canoe Area Wilderness, Minnesota. Lake chains are real. Rod counts are design values in
          the range paddlers report, not a substitute for a Fisher or Voyageur map, a permit, or
          the weather.
        </p>
      </footer>
    </div>
  );
}
