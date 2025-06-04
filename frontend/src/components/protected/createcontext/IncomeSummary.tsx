"use client";

import { Calculator } from "lucide-react";

interface IncomeSummaryProps {
  total: number;
}

export function IncomeSummary({ total }: IncomeSummaryProps) {
  return (
    <div className="flex items-center gap-2 text-lg">
      <Calculator className="h-5 w-5" />
      <span>合計金額:</span>
      <span className="font-bold text-xl text-green-600">¥{total.toLocaleString()}</span>
    </div>
  );
}
