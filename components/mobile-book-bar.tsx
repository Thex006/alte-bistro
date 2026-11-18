"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { BookButton } from "./book-button";
import { OpenBadge } from "./open-badge";
import { EASE } from "@/lib/motion";

/** Phones only: the booking action stays under the thumb once the hero scrolls away. */
export function MobileBookBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.6));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-4 rounded-full border border-bone/10 bg-char/80 p-2 pl-4 shadow-[0_8px_32px_rgb(0_0_0/0.4)] backdrop-blur-xl md:hidden"
        >
          <OpenBadge compact className="caption-2 min-w-0 whitespace-nowrap text-bone-2" />
          <BookButton size="sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
