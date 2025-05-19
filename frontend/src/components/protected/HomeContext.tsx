"use client";

import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { getExpenses } from "@/api/controllers/expenseController";
import { getIncomes } from "@/api/controllers/incomeController";
import { TransactionHeader } from "./homecontext/TransactionHeader";
import { TransactionCalendar } from "./homecontext/TransactionCalendar";
import { DailyTransactions } from "./homecontext/DailyTransactions";
import { Transaction, Expense, Income } from "@/types/transaction";

export function HomeContext() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const expenseData = await getExpenses();
        setExpenses(expenseData);
        const incomeData = await getIncomes();
        setIncomes(incomeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const expenseTransactions = expenses.map((expense) => {
    return {
      id: expense.id,
      date: expense.spentAt ? parseISO(expense.spentAt) : new Date(),
      type: "expense" as const,
      amount: expense.amount,
      normalCategory: expense.normalCategoryName,
      specialCategory: expense.specialCategoryName,
      emotionCategory: expense.emotionCategoryName,
      normalCategoryColor: expense.normalCategoryColor,
      specialCategoryColor: expense.specialCategoryColor,
      emotionCategoryColor: expense.emotionCategoryColor,
      description: expense.memo || "詳細なし",
    };
  });

  const incomeTransactionsFromApi = incomes.map((income) => {
    return {
      id: income.id,
      date: income.savedAt ? new Date(income.savedAt) : new Date(),
      type: "income" as const,
      amount: income.income,
      category: "収入",
      normalCategory: null,
      specialCategory: null,
      emotionCategory: null,
      normalCategoryColor: null,
      specialCategoryColor: null,
      emotionCategoryColor: null,
      description: "収入",
    };
  });

  const allTransactions = [
    ...expenseTransactions,
    ...incomeTransactionsFromApi,
  ].filter((t) => isValid(t.date));

  const selectedDateTransactions = allTransactions.filter(
    (t) => format(t.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <TransactionHeader selectedDate={selectedDate} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          <TransactionCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            expenseTransactions={expenseTransactions}
            incomeTransactions={incomeTransactionsFromApi}
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
