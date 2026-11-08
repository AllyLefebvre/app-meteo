import type { ReactNode } from "react";

type PageBackgroundVariant = "accueil" | "previsions";

type PageBackgroundProps = {
  variant: PageBackgroundVariant;
  children: ReactNode;
};

const HALO_POSITIONS: Record<
  PageBackgroundVariant,
  { froid: string; chaud: string }
> = {
  accueil: {
    froid:
      "-bottom-[76px] -left-[140px] size-[360px] md:-bottom-[140px] md:-left-[120px] md:size-[520px]",
    chaud:
      "-top-[120px] -right-[130px] size-[320px] md:-top-[160px] md:-right-[130px] md:size-[520px]",
  },
  previsions: {
    froid:
      "top-[300px] -left-[160px] size-[360px] md:top-[200px] md:-left-[200px] md:size-[600px]",
    chaud:
      "top-[1300px] -right-[150px] size-[360px] md:top-[700px] md:-right-[160px] md:size-[600px]",
  },
};

const HALO_BASE =
  "pointer-events-none absolute rounded-full opacity-60 blur-[56px] md:blur-[80px]";

export default function PageBackground({
  variant,
  children,
}: PageBackgroundProps) {
  const halos = HALO_POSITIONS[variant];

  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-linear-to-br/srgb from-accent via-fond-milieu via-55% to-fond-fin">
      <div aria-hidden className={`${HALO_BASE} bg-halo-froid ${halos.froid}`} />
      <div aria-hidden className={`${HALO_BASE} bg-halo-chaud ${halos.chaud}`} />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
