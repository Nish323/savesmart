"use client";

import { format, isValid } from "date-fns";
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
            {isValid(selectedDate) 
              ? format(selectedDate, "yyyy年 MM月 dd日")
              : "無効な日付"
            }の収支
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <HomeList
                  key={transaction.id}
                  transaction={transaction}
                  showDate={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              この日の記録はありません
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
