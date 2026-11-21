import Icon, { ICON_NAMES } from "@/components/ui/Icon";

// Page temporaire de vérification visuelle (WTM-13) : à ne pas livrer.
const SIZES = [12, 24, 132] as const;

export default function IconesPage() {
  return (
    <main className="min-h-screen bg-[#F7F5FC] p-8 font-sans text-[#3B0764]">
      <h1 className="mb-8 text-3xl font-bold">Icônes ({ICON_NAMES.length})</h1>

      {SIZES.map((size) => (
        <section key={size} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">{size} px</h2>
          <div className="flex flex-wrap items-end gap-6">
            {ICON_NAMES.map((name) => (
              <figure key={name} className="flex flex-col items-center gap-2">
                <Icon name={name} size={size} />
                <figcaption className="text-xs opacity-70">{name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Couleur héritée</h2>
        <div className="flex gap-6">
          <span className="text-[#A855F7]"><Icon name="etincelles" size={32} /></span>
          <span className="text-[#FDBA74]"><Icon name="soleil" size={32} /></span>
          <span className="rounded-2xl bg-[#3B0764] p-3 text-white"><Icon name="recherche" size={24} /></span>
        </div>
      </section>
    </main>
  );
}
