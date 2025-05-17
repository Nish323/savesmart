"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransactionHeaderProps {
  selectedDate: Date;
}

export function TransactionHeader({ selectedDate }: TransactionHeaderProps) {
  const router = useRouter();

  const handleRecordTransaction = (type: "income" | "expense") => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    router.push(`/create?type=${type}&date=${formattedDate}`);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">ホーム</h1>
        <p className="text-gray-600">収支カレンダー</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2"
      >
        <Button variant="outline" onClick={() => handleRecordTransaction("income")}>
          <TrendingUp className="h-4 w-4 mr-2" />
          収入を記録
        </Button>
        <Button onClick={() => handleRecordTransaction("expense")}>
          <TrendingDown className="h-4 w-4 mr-2" />
          支出を記録
        </Button>
      </motion.div>
    </div>
  );
}
