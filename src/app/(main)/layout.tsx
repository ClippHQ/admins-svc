"use client";

import Link from "next/link";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Applications", href: "/applications" },
    { name: "Deposits", href: "/deposits" },
    { name: "Payouts", href: "/payouts" },
    { name: "Sign out", href: "/auth/signin" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-2">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">
                  Kite
                </div>
                <div>
                  <Typography variant="subtitle1" component="div">
                    Kite Finance
                  </Typography>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Portal
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-2 transition ${
                      pathname === link.href
                        ? "bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-200 font-semibold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-10">{children}</main>
        </div>
      </div>
    </div>
  );
}