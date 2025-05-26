"use client";

import { useState, useEffect } from "react";
import { getExpenses } from "@/api/controllers/expenseController";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Expense } from "@/types/transaction";
import { HomeList } from "./sharedComponent/HomeList";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";
import { parseISO } from "date-fns/parseISO";

export function ExpensesList() {
  const [expenses, setExpenses] = useState<ExpenseAndIncomeTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        // Expense型からExpenseAndIncomeTransaction型に変換
        const convertedExpenses = data.map((expense: Expense) => ({
          id: expense.id,
          date: expense.spentAt ? parseISO(expense.spentAt) : new Date(),
          type: "expense" as const,
          amount: expense.amount,
          normalCategory: expense.normalCategoryName || "",
          specialCategory: expense.specialCategoryName || "",
          emotionCategory: expense.emotionCategoryName || "",
          normalCategoryColor: expense.normalCategoryColor || "",
          specialCategoryColor: expense.specialCategoryColor || "",
          emotionCategoryColor: expense.emotionCategoryColor || "",
          description: expense.memo || "詳細なし",
        }));
        // 日付で降順ソートして最新の5件を取得
        const sortedExpenses = convertedExpenses.sort(
          (a: ExpenseAndIncomeTransaction, b: ExpenseAndIncomeTransaction) =>
            b.date.getTime() - a.date.getTime()
        );
        const latestExpenses = sortedExpenses.slice(0, 5);
        setExpenses(latestExpenses);
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
        {expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <HomeList
                key={expense.id}
                transaction={expense}
                showDate={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">支出はありません</div>
        )}
      </CardContent>
    </Card>
  );
}
