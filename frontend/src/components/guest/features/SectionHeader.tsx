"use client";

import { motion } from "framer-motion";

export type SectionHeaderProps = {
  title: string;
  description: string;
};

export const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center mb-16"
  >
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      {description}
    </p>
  </motion.div>
);
