"use client";

import { motion } from "framer-motion";
import { Flame, MoonStar, Wheat } from "lucide-react";
import { Framed } from "./motion/framed";
import { SplitReveal } from "./motion/split-reveal";
import { VIEWPORT, reveal } from "@/lib/motion";
import { site } from "@/lib/site";

const tile = "relative overflow-hidden bg-smoke";

export function StoryBento() {
  return (
    <section id="story" aria-labelledby="story-title" className="bg-coal px-4 py-24 md:px-12 md:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[minmax(160px,auto)]"
      >
        <div className="md:col-span-7 md:row-span-3 md:mb-2 md:mr-2">
          <Framed
            src="/images/chefs-high-five.jpg"
            alt="Two chefs high five across the pass during service"
            vw={{ desktop: 56, mobile: 92 }}
            ratio={16 / 11}
            focus="50% 40%"
          />
        </div>

        <motion.div variants={reveal} className={`${tile} flex flex-col justify-between gap-8 p-8 md:col-span-5 md:row-span-2 md:p-12`}>
          <SplitReveal id="story-title" text="Street food fire, fine dining care" accent={["fire"]} className="heading-2 max-w-[14ch]" />
          <div className="flex flex-col gap-4">
            <p className="body-lead text-bone-2">
              Alte Bistro was born to bridge the gap between late night street food and fine dining.
            </p>
            <p className="body-3 text-bone-2">
              Bold West African spices meet premium Hungarian ingredients. The grill does the talking, the
              plates arrive dressed for the room, and nobody rushes you out before one.
            </p>
          </div>
        </motion.div>

        <div className="md:col-span-3 md:mb-2 md:mr-2">
          <Framed
            src="/images/menu-frame.jpg"
            alt="Brass framed Alte Bistro menu on a brick wall by the door"
            vw={{ desktop: 24, mobile: 92 }}
            ratio={5 / 4}
            focus="30% 50%"
          />
        </div>

        <motion.div
          variants={reveal}
          className="flex flex-col justify-between gap-6 border border-ember/50 p-8 md:col-span-2"
        >
          <p className="caption-4 text-ember">As featured in</p>
          <p className="font-display text-2xl leading-8">{site.press}</p>
        </motion.div>

        {[
          {
            Icon: Flame,
            title: "West African heat",
            body: "Suya spice, plantain, pepper and smoke. Flavours built for late nights.",
          },
          {
            Icon: Wheat,
            title: "Hungarian produce",
            body: "Duck from Nyíregyháza and premium local ingredients, cooked with care.",
          },
          {
            Icon: MoonStar,
            title: "Open until one",
            body: "Wednesday to Sunday, 18:00 to 01:00. The kitchen keeps city hours.",
          },
        ].map(({ Icon, title, body }) => (
          <motion.div
            key={title}
            variants={reveal}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`${tile} flex flex-col gap-6 p-8 md:col-span-4`}
          >
            <Icon aria-hidden className="size-8 text-ember" strokeWidth={1.5} />
            <div>
              <h3 className="title-1">{title}</h3>
              <p className="body-3 mt-2 text-bone-2">{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
