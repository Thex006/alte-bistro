import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of use | Alte Bistro" };

export default function Terms() {
  return (
    <LegalPage title="Terms of use">
      <p>Menu items and prices shown are a selection and can change with the season and the market.</p>
      <p>Reviews on this concept site are samples written for the demo and are labelled as such.</p>
      <p>Photographs belong to Alte Bistro and may not be reused without permission.</p>
    </LegalPage>
  );
}
