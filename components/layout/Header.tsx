import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Icon from "@/components/ui/Icon";

/**
 * En-tête desktop (maquette 1440 px : contenu de 1200 px, 40 px du haut).
 * Posé par-dessus le fond de page ; masqué sous le point de rupture md,
 * où les en-têtes mobiles prennent le relais (WMC-16).
 */
export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 hidden md:block">
      <div className="mx-auto flex w-full max-w-[1248px] items-center justify-between px-6 pt-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-encre text-sur-encre">
            <Icon name="etincelles" size={18} />
          </span>
          <span className="text-xl font-bold text-encre">Whimcast</span>
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
