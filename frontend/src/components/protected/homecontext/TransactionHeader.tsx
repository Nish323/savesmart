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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center sm:text-left"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">ホーム</h1>
        <p className="text-gray-600">収支カレンダー</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Button
          variant="outline"
          onClick={() => handleRecordTransaction("income")}
          className="w-full sm:w-auto"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          収入を記録
        </Button>
        <Button
          onClick={() => handleRecordTransaction("expense")}
          className="w-full sm:w-auto"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          支出を記録
        </Button>
      </motion.div>
    </div>
  );
}
