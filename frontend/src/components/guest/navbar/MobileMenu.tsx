"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/utils/contexts/AuthContext";

export type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: (view: "login" | "signup") => void;
};

export const MobileMenu = ({ isOpen, onClose, onAuthClick }: MobileMenuProps) => {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white/90 backdrop-blur-sm border-t">
      <div className="px-4 py-2 space-y-2">
        <Link href="/guide" onClick={onClose}>
          <Button variant="ghost" className="w-full text-left">
            使い方
          </Button>
        </Link>
        
        {isAuthenticated ? (
          // Show authenticated menu items
          <>
            <Link href="/dashboard" onClick={onClose}>
              <Button variant="ghost" className="w-full text-left flex items-center gap-2">
                <User className="h-4 w-4" />
                マイページ
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full text-left flex items-center gap-2"
              onClick={() => {
                onClose();
                logout();
              }}
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </>
        ) : (
          // Show unauthenticated menu items
          <>
            <Button
              variant="outline"
              className="w-full text-left flex items-center gap-2"
              onClick={() => onAuthClick("login")}
            >
              <LogIn className="h-4 w-4" />
              ログイン
            </Button>
            <Button
              className="w-full text-left flex items-center gap-2"
              onClick={() => onAuthClick("signup")}
            >
              <UserPlus className="h-4 w-4" />
              無料で始める
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
