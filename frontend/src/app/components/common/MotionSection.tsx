"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type MotionSectionProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
};

export default function MotionSection({
    children,
    className,
    delay = 0,
    direction = "up",
}: MotionSectionProps) {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return <section className={className}>{children}</section>;
    }

    const x = direction === "left" ? -36 : direction === "right" ? 36 : 0;
    const y = direction === "up" ? 42 : 0;

    return (
        <motion.section
            className={className}
            initial={{ opacity: 0, x, y, scale: 0.985, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.section>
    );
}
