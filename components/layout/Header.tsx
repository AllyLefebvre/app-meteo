import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/ui/Logo";

/**
 * En-tête desktop (maquette 1440 px : contenu de 1200 px, 40 px du haut).
 * Posé par-dessus le fond de page ; masqué sous le point de rupture md,
 * où chaque page affiche son en-tête mobile (MobileHeader).
 */
export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 hidden md:block">
      <div className="mx-auto flex w-full max-w-[1248px] items-center justify-between px-6 pt-10">
        <Link
          href="/"
          aria-label="Whimcast, accueil"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
        >
          <Logo />
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
