import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-bodoni",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Alte Bistro | West African heat, Hungarian comfort, Budapest VII",
  description: site.description,
  // Demo build: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Alte Bistro, Budapest",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Alte Bistro on Kazinczy utca" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

const THEME_SCRIPT = `try{var t=localStorage.getItem("alte-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#131209",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${bodoni.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint so light mode never flashes dark. Dark is the default. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="button-sm fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ember px-3 py-2 text-ink transition-transform duration-300 ease-out-expo focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
