"use client";

import { PiggyBank } from "lucide-react";

export const FooterLogo = () => (
  <div className="flex items-center space-x-2 mb-4">
    <PiggyBank className="h-6 w-6 text-primary" />
    <span className="text-lg font-bold">SaveSmart</span>
  </div>
);
