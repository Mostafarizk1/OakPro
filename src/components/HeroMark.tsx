"use client";
import { motion, useReducedMotion } from "framer-motion";

/* Oak mark built from three stacked rhombuses + a root rhombus (geometry traced from the official logo).
   Stacks up from the root: root → lower → middle → top, ≈1.5s, ease-out, plays once.
   HERO_MEDIA_SLOT: replace <HeroMark/> in the hero with a <video>/Lottie when the client provides one. */
const pieces = [
  { d: "M965 830 L1052 880 L965 930 L878 880 Z" },      // root
  { d: "M965 531 L1224 681 L965 830 L706 681 Z" },      // lower
  { d: "M965 331 L1311 531 L965 731 L620 531 Z" },      // middle
  { d: "M965 232 L1224 381 L965 530 L706 381 Z" },      // top
];

export default function HeroMark({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="600 220 730 725" className={className} role="img" aria-label="OAK PRO">
      {pieces.map((p, i) => (
        <motion.path key={i} d={p.d} fill="currentColor"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.33, ease: [0.22, 0.61, 0.36, 1] }} />
      ))}
    </svg>
  );
}
