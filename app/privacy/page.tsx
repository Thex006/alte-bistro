import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy policy | Alte Bistro" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>This site sets no cookies and runs no analytics or tracking scripts.</p>
      <p>
        Reservations are handled by OpenTable. When you follow a Book a table link, OpenTable&rsquo;s own privacy
        policy applies to the details you give them.
      </p>
      <p>This is a concept site built as a demo. The restaurant will publish its full policy before launch.</p>
    </LegalPage>
  );
}
