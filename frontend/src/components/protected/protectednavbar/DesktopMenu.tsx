"use client";

import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Receipt, Target, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

export type DesktopMenuProps = {
  isActive: (path: string) => boolean;
};

export const DesktopMenu = ({ isActive }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/home">
        <Button
          variant={isActive("/home") ? "default" : "ghost"}
          className="flex gap-2"
        >
          <Home className="h-4 w-4" />
          ホーム
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button
          variant={isActive("/dashboard") ? "default" : "ghost"}
          className="flex gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          ダッシュボード
        </Button>
      </Link>
      <Link href="/dashboard/expenses">
        <Button
          variant={isActive("/dashboard/expenses") ? "default" : "ghost"}
          className="flex gap-2"
        >
          <Receipt className="h-4 w-4" />
          収支を記録
        </Button>
      </Link>
      <Link href="/dashboard/goals">
        <Button
          variant={isActive("/dashboard/goals") ? "default" : "ghost"}
          className="flex gap-2"
        >
          <Target className="h-4 w-4" />
          目標
        </Button>
      </Link>

      <div className="flex items-center space-x-2 ml-2 border-l pl-2">
        <UserMenu />
      </div>
    </div>
  );
};
