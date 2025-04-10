"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export type NavLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  isMobile?: boolean;
};

export const NavLink = ({ href, icon, label, isActive, onClick, isMobile = false }: NavLinkProps) => (
  <Link href={href} onClick={onClick}>
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`flex gap-2 ${isMobile ? "w-full text-left" : ""}`}
    >
      {icon}
      {label}
    </Button>
  </Link>
);
