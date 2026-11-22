import { NextResponse, type NextRequest } from "next/server";
import {
  DERNIERE_VILLE_COOKIE,
  VILLE_PAR_DEFAUT,
  lienPrevisions,
  lireCookieVille,
  lirePrevisionsParams,
} from "@/lib/previsions";

/**
 * /previsions sans ville valide (lien « Prévisions » du menu) : redirection
 * vers la dernière ville consultée, sinon Montréal. Avec une ville valide, la
 * page s'affiche normalement ; c'est elle qui retient la ville (RetenirVille).
 */
export function proxy(request: NextRequest) {
  if (lirePrevisionsParams(Object.fromEntries(request.nextUrl.searchParams))) {
    return NextResponse.next();
  }

  const derniere = lireCookieVille(request.cookies.get(DERNIERE_VILLE_COOKIE)?.value);
  return NextResponse.redirect(new URL(lienPrevisions(derniere ?? VILLE_PAR_DEFAUT), request.url));
}

export const config = {
  matcher: "/previsions",
};
