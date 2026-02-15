"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
    initial: { opacity: 0, y: 20, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, filter: "blur(4px)" },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};
