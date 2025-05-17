"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getExpenses } from "@/api/controllers/expenseController";
import { TransactionHeader } from "./homecontext/TransactionHeader";
import { TransactionCalendar } from "./homecontext/TransactionCalendar";
import { DailyTransactions } from "./homecontext/DailyTransactions";
import { Transaction, Expense } from "@/types/transaction";

// 仮のデータ（収入用）
const incomeTransactions = [
  { date: new Date(2025, 5, 15), type: "income" as const, amount: 280000, category: "給与", description: "3月分給与" },
];

export function HomeContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 支出データを取得
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

  // 支出データを日付ごとのトランザクションに変換
  const expenseTransactions = expenses.map(expense => ({
    date: new Date(expense.spentAt),
    type: "expense" as const,
    amount: expense.amount,
    category: `カテゴリID: ${expense.normalCategoryId}`,
    description: expense.memo || '詳細なし'
  }));

  // 収入と支出を合わせたトランザクション
  const allTransactions = [...expenseTransactions, ...incomeTransactions];

  // 選択された日付のトランザクション
  const selectedDateTransactions = allTransactions.filter(
    (t) => format(t.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <TransactionHeader selectedDate={selectedDate} />
        
        <div className="grid lg:grid-cols-4 gap-8">
          <TransactionCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            expenseTransactions={expenseTransactions}
            incomeTransactions={incomeTransactions}
          />
          
          <DailyTransactions
            selectedDate={selectedDate}
            transactions={selectedDateTransactions}
          />
        </div>
      </div>
    </div>
  );
}
