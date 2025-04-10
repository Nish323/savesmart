"use client";

import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Receipt, Target, Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/utils/contexts/AuthContext";

export type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isActive: (path: string) => boolean;
};

export const MobileMenu = ({ isOpen, onClose, isActive }: MobileMenuProps) => {
  const { logout } = useAuth();
  
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-white/90 backdrop-blur-sm border-t">
      <div className="px-4 py-2 space-y-2">
        <Link href="/dashboard" onClick={onClose}>
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            className="w-full text-left flex gap-2"
          >
            <Home className="h-4 w-4" />
            ホーム
          </Button>
        </Link>
        <Link href="/dashboard/overview" onClick={onClose}>
          <Button
            variant={isActive("/dashboard/overview") ? "default" : "ghost"}
            className="w-full text-left flex gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            ダッシュボード
          </Button>
        </Link>
        <Link href="/dashboard/expenses" onClick={onClose}>
          <Button
            variant={isActive("/dashboard/expenses") ? "default" : "ghost"}
            className="w-full text-left flex gap-2"
          >
            <Receipt className="h-4 w-4" />
            収支を記録
          </Button>
        </Link>
        <Link href="/dashboard/goals" onClick={onClose}>
          <Button
            variant={isActive("/dashboard/goals") ? "default" : "ghost"}
            className="w-full text-left flex gap-2"
          >
            <Target className="h-4 w-4" />
            目標
          </Button>
        </Link>
        <div className="border-t pt-2">
          <Link href="/dashboard/settings/profile" onClick={onClose}>
            <Button
              variant="ghost"
              className="w-full text-left flex gap-2"
            >
              <Settings className="h-4 w-4" />
              アカウント設定
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full text-left flex gap-2 text-red-600"
            onClick={() => {
              onClose();
              logout();
            }}
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
};
