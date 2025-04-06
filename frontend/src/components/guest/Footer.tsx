"use client";

import { motion } from "framer-motion";
import {
  FooterLogo,
  FooterCopyright,
  FooterNavigation
} from "@/components/guest/footer";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <FooterLogo />
          <p className="text-gray-600 max-w-md mx-auto">
            スマートな貯金で、明るい未来を。
          </p>
          
          <FooterNavigation />
        </div>
        
        <FooterCopyright />
      </div>
    </motion.footer>
  );
}
