"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// 色名からTailwindクラス名に変換するヘルパー関数
const getColorClass = (colorName: string | null | undefined): string => {
  if (!colorName) return "bg-gray-200";

  // 色名に応じたマッピング
  // APIから返ってくる色名に合わせて追加・調整してください
  const colorMap: Record<string, string> = {
    gray: "bg-gray-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    // 他の色も必要に応じて追加
  };

  return colorMap[colorName.toLowerCase()] || "bg-gray-200";
};

// トランザクションの型定義
interface Transaction {
  date: Date;
  type: "expense" | "income";
  amount: number;
  normalCategory: string;
  specialCategory: string;
  emotionCategory: string;
  normalCategoryColor: string;
  specialCategoryColor: string;
  emotionCategoryColor: string;
  description: string;
}

interface DailyTransactionsProps {
  selectedDate: Date;
  transactions: Transaction[];
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
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {transaction.type === "expense" ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">
                        ¥{transaction.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {transaction.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getColorClass(
                        transaction.normalCategoryColor
                      )} text-white`}
                      variant={
                        transaction.type === "expense"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {transaction.normalCategory}
                    </Badge>
                    <Badge
                      className={`${getColorClass(
                        transaction.specialCategoryColor
                      )} text-white`}
                      variant={
                        transaction.type === "expense"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {transaction.specialCategory}
                    </Badge>
                    <Badge
                      className={`${getColorClass(
                        transaction.emotionCategoryColor
                      )} text-white`}
                      variant={
                        transaction.type === "expense"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {transaction.emotionCategory}
                    </Badge>
                  </div>
                </div>
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
