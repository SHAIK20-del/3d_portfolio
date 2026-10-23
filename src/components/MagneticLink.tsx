import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

export default function MagneticLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18 });
  return (
    <motion.a
      href={href}
      className="button primary"
      style={{ x, y }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType === "touch") return;
        const box = event.currentTarget.getBoundingClientRect();
        rawX.set((event.clientX - box.left - box.width / 2) * 0.12);
        rawY.set((event.clientY - box.top - box.height / 2) * 0.2);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}
