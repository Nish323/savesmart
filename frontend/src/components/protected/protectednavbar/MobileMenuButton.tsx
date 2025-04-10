"use client";

import { Menu, X } from "lucide-react";

export type MobileMenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => (
  <div className="md:hidden">
    <button onClick={onClick} className="p-2">
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  </div>
);
