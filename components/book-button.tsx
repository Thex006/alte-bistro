import { ArrowUpRight } from "lucide-react";
import { OPENTABLE_URL } from "@/lib/site";

type Props = { size?: "sm" | "md" | "lg"; className?: string; label?: string };

const sizes = {
  sm: "button-sm h-9 px-4 gap-1.5",
  md: "button-md h-12 px-6 gap-2",
  lg: "button-md h-14 px-8 gap-2 md:text-lg",
};

/** The one primary action on the site. Always OpenTable, always a new tab. */
export function BookButton({ size = "md", className = "", label = "Book a table" }: Props) {
  return (
    <a
      href={OPENTABLE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="book"
      className={`group inline-flex shrink-0 items-center justify-center rounded-full bg-ember text-char transition-[transform,background-color] duration-300 ease-out-expo hover:bg-ember-hi active:scale-[0.97] ${sizes[size]} ${className}`}
    >
      <span>{label}</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={2.25}
      />
      <span className="sr-only">(opens OpenTable in a new tab)</span>
    </a>
  );
}
