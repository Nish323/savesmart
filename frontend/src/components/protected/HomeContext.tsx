"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import { ja } from "date-fns/locale";
import { getExpenses } from "@/api/controllers/expenseController";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Plus,
  Calendar as CalendarIcon,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

// 仮のデータ（収入用）
const incomeTransactions = [
  { date: new Date(2025, 5, 15), type: "income", amount: 280000, category: "給与", description: "3月分給与" },
];

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

export function HomeContent() {
  const router = useRouter();
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

  // カレンダーの日付マーカー
  const modifiers = {
    expense: expenseTransactions.map(t => t.date),
    income: incomeTransactions.map(t => t.date),
  };

  const modifiersStyles = {
    expense: {
      color: "white",
      backgroundColor: "rgb(239 68 68)",
    },
    income: {
      color: "white",
      backgroundColor: "rgb(34 197 94)",
    },
  };

  const handleRecordTransaction = (type: "income" | "expense") => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    router.push(`/create?type=${type}&date=${formattedDate}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">ホーム</h1>
            <p className="text-gray-600">収支カレンダー</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-2"
          >
            <Button variant="outline" onClick={() => handleRecordTransaction("income")}>
              <TrendingUp className="h-4 w-4 mr-2" />
              収入を記録
            </Button>
            <Button onClick={() => handleRecordTransaction("expense")}>
              <TrendingDown className="h-4 w-4 mr-2" />
              支出を記録
            </Button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {format(currentMonth, "yyyy年 MM月", { locale: ja })}
                  </CardTitle>
                  <div className="flex gap-4">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(subYears(currentMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                        className="h-8"
                      >
                        {format(currentMonth, "yyyy年", { locale: ja })}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(addYears(currentMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                        className="h-8"
                      >
                        {format(currentMonth, "MM月", { locale: ja })}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className="rounded-md border w-full"
                    classNames={{
                      months: "space-y-4",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-12 w-full",
                      day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
                {selectedDateTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateTransactions.map((transaction, index) => (
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
                        <Badge variant={transaction.type === "expense" ? "destructive" : "secondary"}>
                          {transaction.category}
                        </Badge>
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
        </div>
      </div>
    </div>
  );
}
