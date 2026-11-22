import type { Metadata } from "next";
import MobileHeader from "@/components/layout/MobileHeader";
import PageBackground from "@/components/layout/PageBackground";
import { formaterDateCourte } from "@/lib/format";

export const metadata: Metadata = {
  title: "Prévisions · Whimcast",
};

/**
 * Page Prévisions provisoire : seul l'en-tête mobile est en place (WMC-16).
 * Le contenu et les vraies données arrivent avec WMC-27.
 */
const EXEMPLE = {
  lieu: "Montréal, QC",
  fuseau: "America/Toronto",
  date: new Date("2026-11-07T19:55:00Z"),
};

export default function Previsions() {
  return (
    <PageBackground variant="previsions">
      <MobileHeader
        variant="previsions"
        lieu={EXEMPLE.lieu}
        date={formaterDateCourte(EXEMPLE.date, EXEMPLE.fuseau)}
      />
    </PageBackground>
  );
}
