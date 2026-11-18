import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main" className="mx-auto min-h-screen max-w-2xl px-4 py-24 md:py-32">
      <Link href="/" className="button-sm inline-flex items-center gap-2 text-bone-2 transition-colors duration-300 hover:text-bone">
        <ArrowLeft aria-hidden className="size-4" /> Back to Alte Bistro
      </Link>
      <h1 className="heading-1 mt-12">{title}</h1>
      <div className="body-3 mt-8 flex flex-col gap-4 text-bone-2">{children}</div>
    </main>
  );
}
