"use client";

import Link from "next/link";
import { LayoutDashboard, ListChecks, Map, FlaskConical } from "lucide-react";
import ReadingMenu from "@/components/shared/ReadingMenu";

const navItems = [
  { href: "/", label: "מפת הדרך", icon: Map, external: true },
  { href: "#overview", label: "לוח בקרה", icon: LayoutDashboard, external: false },
  { href: "#steps", label: "המסלול שלי", icon: ListChecks, external: false },
  { href: "#tests", label: "בדיקות", icon: FlaskConical, external: false },
];

export default function DashboardNav() {
  return (
    <nav
      className="no-print flex flex-wrap items-center gap-1.5 sm:gap-2"
      aria-label="ניווט בדשבורד"
    >
      <ReadingMenu />
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800"
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
