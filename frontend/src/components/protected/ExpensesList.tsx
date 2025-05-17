"use client";

import { useState, useEffect } from "react";
import { getExpenses } from "@/api/controllers/expenseController";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

// 支出データの型定義
interface Expense {
  id: number;
  userId: number;
  normalCategoryId: number;
  specialCategoryId: number;
  emotionCategoryId: number;
  amount: number;
  memo: string | null;
  spentAt: string;
  year: number;
  month: number;
  day: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

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
        console.error('Error fetching expenses:', error);
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
                    {expense.memo || '詳細なし'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {expense.spentAt}
                  </div>
                </div>
                <Badge variant="destructive">
                  カテゴリID: {expense.normalCategoryId}
                </Badge>
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
