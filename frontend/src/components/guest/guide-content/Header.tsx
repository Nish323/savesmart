"use client";

import { motion } from "framer-motion";

export const GuideHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <h1 className="text-4xl font-bold mb-4">SaveSmartの使い方</h1>
    <p className="text-xl text-gray-600">
      SaveSmartの基本的な機能と使い方をご紹介します。
    </p>
  </motion.div>
);
