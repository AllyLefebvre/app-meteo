"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS = [
  { href: "/", libelle: "Accueil" },
  { href: "/previsions", libelle: "Prévisions" },
  { href: "/carte", libelle: "Carte" },
  { href: "/a-propos", libelle: "À propos" },
] as const;

function estActif(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="rounded-full border border-verre-bordure bg-verre p-[7px] shadow-verre backdrop-blur-verre"
    >
      <ul className="flex items-center gap-1">
        {LIENS.map(({ href, libelle }) => {
          const actif = estActif(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={actif ? "page" : undefined}
                className={[
                  "flex h-9 items-center rounded-full px-4 text-[15px] font-medium text-encre transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre",
                  actif ? "bg-verre-fort" : "hover:bg-verre",
                ].join(" ")}
              >
                {libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
