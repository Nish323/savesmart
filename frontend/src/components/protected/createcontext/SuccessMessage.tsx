"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800"
    >
      <CheckCircle className="h-5 w-5" />
      {message}
    </motion.div>
  );
}
