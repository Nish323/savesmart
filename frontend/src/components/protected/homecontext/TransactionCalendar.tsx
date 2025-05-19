"use client";

import { format, addMonths, subMonths, addYears, subYears } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// トランザクションの型定義
interface Transaction {
  date: Date;
  type: "expense" | "income";
}

interface TransactionCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  expenseTransactions: Transaction[];
  incomeTransactions: Transaction[];
}

export function TransactionCalendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  expenseTransactions,
  incomeTransactions,
}: TransactionCalendarProps) {
  // カレンダーの日付マーカー
  const modifiers = {
    expense: expenseTransactions.map((t) => t.date),
    income: incomeTransactions.map((t) => t.date),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-3"
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentMonth, "yyyy年 MM月", { locale: ja })}
            </CardTitle>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
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
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "grid grid-cols-7 place-items-center",
                head_cell:
                  "text-muted-foreground rounded-md font-normal text-[0.8rem] text-center py-2 px-0 w-full",
                row: "grid grid-cols-7 place-items-center mt-2",
                cell: "text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-8 w-8 sm:h-10 sm:w-10",
                day: "h-8 w-8 sm:h-10 sm:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors flex items-center justify-center w-full h-full text-center",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
