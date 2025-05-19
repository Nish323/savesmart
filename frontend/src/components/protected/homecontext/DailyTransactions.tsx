"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { HomeList } from "./sharedComponent/HomeList";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";

interface DailyTransactionsProps {
  selectedDate: Date;
  transactions: ExpenseAndIncomeTransaction[];
}

export function DailyTransactions({
  selectedDate,
  transactions,
}: DailyTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, "yyyy年 MM月 dd日", { locale: ja })}の収支
          </CardTitle>
        </CardHeader>
        <HomeList transactions={transactions} />
      </Card>
    </motion.div>
  );
}
