import Image from "next/image";
import Link from "next/link";
import { BookButton } from "./book-button";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-char px-4 pb-32 pt-24 md:px-12 md:pb-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <Image
            src="/images/logo.png"
            alt="Alte Bistro"
            width={504}
            height={232}
            className="h-auto w-56 md:w-72"
          />
          <BookButton size="lg" />
        </div>
        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="body-6 text-bone-2 transition-colors duration-300 hover:text-bone">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="body-6 text-bone-2">
            <p>{site.address.street}</p>
            <p>{site.address.city}</p>
            <p className="mt-2">Wednesday to Sunday, 18:00 to 01:00</p>
          </div>
          <ul className="flex flex-col gap-2 sm:items-end">
            <li>
              <Link href="/privacy" className="body-6 text-bone-2 transition-colors duration-300 hover:text-bone">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="body-6 text-bone-2 transition-colors duration-300 hover:text-bone">
                Terms of use
              </Link>
            </li>
          </ul>
        </div>
        <p className="caption-2 text-bone-3">
          © {new Date().getFullYear()} {site.name}. Concept site built as an agency demo. Reviews shown are samples.
        </p>
      </div>
    </footer>
  );
}
