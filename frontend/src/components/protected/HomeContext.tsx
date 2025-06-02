"use client";

import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { getExpenses } from "@/api/controllers/expenseController";
import { getIncomes } from "@/api/controllers/incomeController";
import { TransactionHeader } from "./homeContext/TransactionHeader";
import { TransactionCalendar } from "./homeContext/TransactionCalendar";
import { DailyTransactions } from "./homeContext/DailyTransactions";
import { Expense, Income } from "@/types/transaction";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";

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

  const expenseTransactions: ExpenseAndIncomeTransaction[] = expenses.map((expense) => {
    // 安全な日付解析
    let date: Date;
    try {
      if (expense.spentAt) {
        const parsedDate = new Date(expense.spentAt);
        date = isValid(parsedDate) ? parsedDate : new Date();
      } else {
        date = new Date();
      }
    } catch (error) {
      console.warn('Invalid date format for expense:', expense.spentAt);
      date = new Date();
    }

    return {
      id: expense.id,
      date: date,
      type: "expense" as const,
      amount: expense.amount,
      normalCategory: expense.normalCategoryName,
      specialCategory: expense.specialCategoryName,
      emotionCategory: expense.emotionCategoryName,
      normalCategoryColor: expense.normalCategoryColor || null,
      specialCategoryColor: expense.specialCategoryColor || null,
      emotionCategoryColor: expense.emotionCategoryColor || null,
      description: expense.memo || "詳細なし",
    };
  });

  const incomeTransactions: ExpenseAndIncomeTransaction[] = incomes.map((income) => {
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
      description: income.memo || "収入",
    };
  });

  const allTransactions = [
    ...expenseTransactions,
    ...incomeTransactions,
  ].filter((t) => isValid(t.date));

  const selectedDateTransactions = allTransactions.filter((t) => {
    try {
      if (!isValid(t.date) || !isValid(selectedDate)) {
        return false;
      }
      return format(t.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    } catch (error) {
      console.warn('Date formatting error:', error);
      return false;
    }
  });

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <TransactionHeader selectedDate={selectedDate} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
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
