"use client";

import { PiggyBank } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/home" className="flex items-center space-x-2">
    <PiggyBank className="h-8 w-8 text-primary" />
    <span className="text-xl font-bold">SaveSmart</span>
  </Link>
);
