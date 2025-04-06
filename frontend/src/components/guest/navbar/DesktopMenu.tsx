"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/utils/contexts/AuthContext";

export type DesktopMenuProps = {
  onAuthClick: (view: "login" | "signup") => void;
};

export const DesktopMenu = ({ onAuthClick }: DesktopMenuProps) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/guide">
        <Button variant="ghost">使い方</Button>
      </Link>
      
      {isAuthenticated ? (
        // Show dashboard link if authenticated
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            マイページ
          </Button>
        </Link>
      ) : (
        // Show login/signup buttons if not authenticated
        <>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onAuthClick("login")}
          >
            <LogIn className="h-4 w-4" />
            ログイン
          </Button>
          <Button
            onClick={() => onAuthClick("signup")}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            無料で始める
          </Button>
        </>
      )}
    </div>
  );
};
