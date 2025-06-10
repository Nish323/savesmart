"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/contexts/AuthContext";
import {
  Logo,
  DesktopMenu,
  MobileMenuButton,
  MobileMenu,
} from "./protectedNavbar";

export function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <DesktopMenu isActive={isActive} />
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isActive={isActive}
        />
      </motion.nav>
    </>
  );
}
