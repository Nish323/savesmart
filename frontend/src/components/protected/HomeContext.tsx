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
  // 選択された日付の状態
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // TransactionCalendarコンポーネントに渡すためのラッパー関数
  // Date | undefinedを受け取り、Dateのみをsetする
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // データを取得する関数
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

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchData();
  }, []);

  // トランザクションが更新されたときの処理
  const handleTransactionUpdated = () => {
    fetchData();
    
    // カスタムイベントを発行して他のコンポーネントに通知
    window.dispatchEvent(new CustomEvent('transaction-updated'));
  };
  
  // 日付が変更された場合に選択された日付を更新する関数
  const handleDateChanged = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // 他のコンポーネントからのトランザクション更新イベントをリッスン
  useEffect(() => {
    const handleTransactionUpdatedEvent = () => {
      fetchData();
    };
    
    window.addEventListener('transaction-updated', handleTransactionUpdatedEvent);
    
    return () => {
      window.removeEventListener('transaction-updated', handleTransactionUpdatedEvent);
    };
  }, []);

  const expenseTransactions: ExpenseAndIncomeTransaction[] = expenses.map(
    (expense) => {
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
        console.warn("Invalid date format for expense:", expense.spentAt);
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
    }
  );

  const incomeTransactions: ExpenseAndIncomeTransaction[] = incomes.map(
    (income) => {
      return {
        id: income.id,
        date: income.savedAt ? new Date(income.savedAt) : new Date(),
        type: "income" as const,
        amount: income.amount,
        category: "収入",
        normalCategory: null,
        specialCategory: null,
        emotionCategory: null,
        normalCategoryColor: null,
        specialCategoryColor: null,
        emotionCategoryColor: null,
        description: income.memo || "収入",
      };
    }
  );

  const allTransactions = [
    ...expenseTransactions,
    ...incomeTransactions,
  ].filter((t) => isValid(t.date));

  const selectedDateTransactions = allTransactions.filter((t) => {
    try {
      if (!isValid(t.date) || !selectedDate || !isValid(selectedDate)) {
        return false;
      }
      return (
        format(t.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
    } catch (error) {
      console.warn("Date formatting error:", error);
      return false;
    }
  });

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <TransactionHeader selectedDate={selectedDate || new Date()} />

        <div className="grid grid-cols-1 lg:grid-cols-16 gap-4 lg:gap-8">
          <div className="lg:col-span-9">
            <TransactionCalendar
              selectedDate={selectedDate}
              setSelectedDate={handleDateSelect}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              expenseTransactions={expenseTransactions}
              incomeTransactions={incomeTransactions}
            />
          </div>

          <div className="lg:col-span-7">
            <DailyTransactions
              selectedDate={selectedDate || new Date()}
              transactions={selectedDateTransactions}
              onTransactionUpdated={handleTransactionUpdated}
              onDateChanged={handleDateChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
