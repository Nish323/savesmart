"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  Logo,
  DesktopMenu,
  MobileMenuButton,
  MobileMenu
} from "@/components/guest/navbar";

export function Navbar() {
  // Auth related state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handlers
  const handleAuthClick = (view: "login" | "signup") => {
    setAuthView(view);
    setShowAuthDialog(true);
    setIsMobileMenuOpen(false); // Close mobile menu when auth dialog opens
  };

  const handleCloseDialog = () => {
    setShowAuthDialog(false);
    setAuthView("login"); // Reset to login view when dialog closes
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

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={handleCloseDialog}
        defaultView={authView}
      />
    </>
  );
}
