"use client";

import { motion } from "framer-motion";

/**
 * Route transition.
 *
 * A `template` remounts on every navigation (unlike a `layout`), so this fires
 * once per route change and gives the whole site a consistent entrance instead
 * of pages snapping into place.
 *
 * Deliberately short and subtle — a long transition on a content site reads as
 * latency, not polish. `framer-motion` drops it to instant under reduced
 * motion on its own.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
