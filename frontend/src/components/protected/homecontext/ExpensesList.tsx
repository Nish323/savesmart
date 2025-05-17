"use client";

import { useState, useEffect } from "react";
import { getExpenses } from "@/api/controllers/expenseController";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { Expense } from "@/types/transaction";

// 色名からTailwindクラス名に変換するヘルパー関数
const getColorClass = (colorName: string | null | undefined): string => {
  if (!colorName) return "bg-gray-200";

  // 色名に応じたマッピング
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

export function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の支出</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">読み込み中...</div>
        ) : expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      ¥{expense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {expense.memo || "詳細なし"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {expense.spentAt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getColorClass(
                      expense.normalCategoryColor
                    )} text-white`}
                    variant="destructive"
                  >
                    {expense.normalCategoryName ||
                      `カテゴリID: ${expense.normalCategoryId}`}
                  </Badge>
                  <Badge
                    className={`${getColorClass(
                      expense.specialCategoryColor
                    )} text-white`}
                    variant="destructive"
                  >
                    {expense.specialCategoryName ||
                      `特別: ${expense.specialCategoryId}`}
                  </Badge>
                  <Badge
                    className={`${getColorClass(
                      expense.emotionCategoryColor
                    )} text-white`}
                    variant="destructive"
                  >
                    {expense.emotionCategoryName ||
                      `感情: ${expense.emotionCategoryId}`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            支出データがありません
          </div>
        )}
      </CardContent>
    </Card>
  );
}
