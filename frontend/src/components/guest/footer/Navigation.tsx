"use client";

import Link from "next/link";

export const FooterNavigation = () => (
  <div className="mt-6 flex space-x-6">
    <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
      ホーム
    </Link>
    <Link href="/guide" className="text-gray-600 hover:text-primary transition-colors">
      使い方
    </Link>
  </div>
);
