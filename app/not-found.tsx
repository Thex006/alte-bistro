import Link from "next/link";
import { BookButton } from "@/components/book-button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <p className="font-display text-8xl leading-none text-ember md:text-9xl">404</p>
      <h1 className="heading-2 max-w-[18ch]">This table is not on the floor plan</h1>
      <p className="body-3 max-w-[40ch] text-bone-2">
        The page you asked for does not exist. The kitchen is still open.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <BookButton />
        <Link
          href="/"
          className="button-md inline-flex h-12 items-center rounded-full border border-line px-6 transition-[transform,border-color] duration-300 hover:border-bone-3 active:scale-[0.97]"
        >
          Back to the bistro
        </Link>
      </div>
    </main>
  );
}
