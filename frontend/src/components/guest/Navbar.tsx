"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PiggyBank, LogIn, UserPlus, Menu, X } from "lucide-react";
import Link from "next/link";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function Navbar() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = (view: "login" | "signup") => {
    setAuthView(view);
    setShowAuthDialog(true);
    // モバイルメニューを閉じる
    setIsMobileMenuOpen(false);
  };

  const handleCloseDialog = () => {
    setShowAuthDialog(false);
    // AuthDialog 閉じた際に初期状態にリセット
    setAuthView("login");
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SaveSmart</span>
          </Link>
          
          {/* デスクトップ用メニュー */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about">
              <Button variant="ghost">SaveSmartについて</Button>
            </Link>
            <Link href="/guide">
              <Button variant="ghost">使い方</Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleAuthClick("login")}
            >
              <LogIn className="h-4 w-4" />
              ログイン
            </Button>
            <Button
              onClick={() => handleAuthClick("signup")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              無料で始める
            </Button>
          </div>

          {/* モバイル用メニューボタン */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル用オーバーレイメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm border-t">
            <div className="px-4 py-2 space-y-2">
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left">
                  SaveSmartについて
                </Button>
              </Link>
              <Link href="/guide" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left">
                  使い方
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full text-left flex items-center gap-2"
                onClick={() => handleAuthClick("login")}
              >
                <LogIn className="h-4 w-4" />
                ログイン
              </Button>
              <Button
                className="w-full text-left flex items-center gap-2"
                onClick={() => handleAuthClick("signup")}
              >
                <UserPlus className="h-4 w-4" />
                無料で始める
              </Button>
            </div>
          </div>
        )}
      </motion.nav>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={handleCloseDialog}
        defaultView={authView}
      />
    </>
  );
}
