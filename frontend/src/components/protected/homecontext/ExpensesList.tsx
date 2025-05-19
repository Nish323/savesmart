"use client";

import { useState, useEffect } from "react";
import { getExpenses } from "@/api/controllers/expenseController";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { Expense } from "@/types/transaction";
import { getColorBackGround } from "@/components/protected/color/getColor";
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
        setExpenses(convertedExpenses);
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
      <HomeList transactions={expenses} showDate={true} />
    </Card>
  );
}
