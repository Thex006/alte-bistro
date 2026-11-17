"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { VIEWPORT, reveal } from "@/lib/motion";
import { sampleReviews, site } from "@/lib/site";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 text-ember ${className}`} role="img" aria-label="Five out of five stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden className="size-4 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

export function ReviewsBento() {
  const [lead, ...rest] = [sampleReviews[1], sampleReviews[0], sampleReviews[2], sampleReviews[3]];

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-char px-4 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.h2
            id="reviews-title"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="heading-1 max-w-[14ch]"
          >
            The room and the pour, reviewed
          </motion.h2>
          {/* Honest labelling: these are written for the demo, not collected from guests. */}
          <p className="caption-2 inline-flex max-w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-bone-2">
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            Sample reviews for this demo
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12 grid gap-4 md:grid-cols-12"
        >
          <motion.li variants={reveal} className="flex flex-col justify-between gap-12 bg-smoke p-8 md:col-span-7 md:row-span-2 md:p-12">
            <Quote aria-hidden className="size-8 text-ember" strokeWidth={1.5} />
            <blockquote className="font-display text-3xl leading-9 md:text-5xl md:leading-[1.1]">
              {lead.quote}
            </blockquote>
            <footer className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="title-3">{lead.name}</p>
                <p className="caption-2 text-bone-3">{lead.context}</p>
              </div>
              <Stars />
            </footer>
          </motion.li>

          {rest.slice(0, 1).map((r) => (
            <motion.li key={r.name} variants={reveal} className="flex flex-col justify-between gap-8 bg-smoke p-8 md:col-span-5">
              <blockquote className="body-lead">{r.quote}</blockquote>
              <footer className="flex items-center justify-between gap-4">
                <div>
                  <p className="title-4">{r.name}</p>
                  <p className="caption-2 text-bone-3">{r.context}</p>
                </div>
                <Stars />
              </footer>
            </motion.li>
          ))}

          <motion.li variants={reveal} className="flex flex-col justify-between gap-8 border border-line p-8 md:col-span-5">
            <Stars className="[&_svg]:size-6" />
            <p className="font-display text-3xl leading-9">Featured in {site.press}</p>
          </motion.li>

          {rest.slice(1).map((r) => (
            <motion.li key={r.name} variants={reveal} className="flex flex-col justify-between gap-8 bg-smoke p-8 md:col-span-6">
              <blockquote className="body-lead">{r.quote}</blockquote>
              <footer className="flex items-center justify-between gap-4">
                <div>
                  <p className="title-4">{r.name}</p>
                  <p className="caption-2 text-bone-3">{r.context}</p>
                </div>
                <Stars />
              </footer>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
