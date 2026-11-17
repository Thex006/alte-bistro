"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { BookButton } from "./book-button";
import { OpenBadge } from "./open-badge";
import { budapestClock } from "@/lib/open-status";
import { VIEWPORT, reveal } from "@/lib/motion";
import { hours, site } from "@/lib/site";

const ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function VisitSection() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(ORDER[budapestClock(new Date()).day] ?? null), []);

  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-coal px-4 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <motion.h2
          id="visit-title"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="font-display text-5xl leading-none tracking-tight md:text-8xl lg:text-9xl"
        >
          Kazinczy utca 14
        </motion.h2>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-12 md:gap-8">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={VIEWPORT} className="md:col-span-4">
            <h3 className="title-1">Find us</h3>
            <address className="body-3 mt-4 not-italic text-bone-2">
              {site.address.street}
              <br />
              {site.address.city}
            </address>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-sm mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 transition-[transform,border-color] duration-300 ease-out-expo hover:border-bone-3 active:scale-[0.97]"
            >
              <MapPin aria-hidden className="size-4 text-ember" strokeWidth={1.75} />
              Get directions
            </a>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={VIEWPORT} className="md:col-span-4">
            <h3 className="title-1">Opening hours</h3>
            <OpenBadge className="caption-2 mt-4 text-bone-2" />
            <dl className="mt-6 flex flex-col">
              {hours.map((h) => {
                const isToday = h.day === today;
                return (
                  <div
                    key={h.day}
                    className={`tabular flex justify-between gap-4 py-2 body-6 ${
                      isToday ? "text-bone" : h.time === "Closed" ? "text-bone-3" : "text-bone-2"
                    }`}
                  >
                    <dt>
                      {h.day}
                      {isToday && <span className="ml-2 text-ember">Today</span>}
                    </dt>
                    <dd>{h.time}</dd>
                  </div>
                );
              })}
            </dl>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="flex flex-col gap-6 md:col-span-4"
          >
            <h3 className="title-1">Reservations</h3>
            <p className="body-3 text-bone-2">
              Reserve on OpenTable in a few taps. Your table will be waiting, candle lit.
            </p>
            <BookButton size="lg" className="w-full md:w-fit" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
