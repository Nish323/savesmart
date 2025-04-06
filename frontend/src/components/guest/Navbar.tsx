"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/utils/contexts/AuthContext";
import {
  Logo,
  DesktopMenu,
  MobileMenuButton,
  MobileMenu
} from "@/components/guest/navbar";

export function Navbar() {
  // Auth related state from context
  const { setShowAuthDialog, setAuthDialogView } = useAuth();
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handlers
  const handleAuthClick = (view: "login" | "signup") => {
    setAuthDialogView(view);
    setShowAuthDialog(true);
    setIsMobileMenuOpen(false); // Close mobile menu when auth dialog opens
  };

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
          <DesktopMenu onAuthClick={handleAuthClick} />
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={toggleMobileMenu} 
          />
        </div>

        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onAuthClick={handleAuthClick}
        />
      </motion.nav>

      {/* AuthDialog is now controlled by the AuthContext and rendered at the app level */}
    </>
  );
}
