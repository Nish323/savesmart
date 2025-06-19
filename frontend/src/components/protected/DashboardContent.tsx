// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  PieChart,
  Wallet,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ComposedChart,
} from "recharts";
import {
  NormalCategory,
  SpecialCategory,
  EmotionCategory,
} from "@/types/category";
import {
  MonthIncome,
  MonthExpense,
  MonthNormalExpense,
  MonthSpecialExpense,
  MonthEmotionExpense,
} from "@/types/monthTransactions";
import { useState, useEffect } from "react";
import { getSavings } from "@/api/controllers/savingController";
import {
  getMonthIncomes,
  getMonthExpenses,
  getMonthNormalCategoryExpenses,
  getMonthSpecialCategoryExpenses,
  getMonthEmotionCategoryExpenses,
} from "@/api/controllers/monthTransactionController";
import { getColorBackGround, getColorText } from "../color/getColor";
import { Saving } from "@/types/saving";
import { SavingLineGraph } from "./dashboard/SavingLineGraph";
import { getDashboardData } from "@/api/controllers/dashboardControllr";
import { Expense } from "@/types/expense";
import { getCurrentMonthData } from "./dashboard/dataProcessings/getCurrentMonthData";
import { CurrentMonthDataCards } from "./dashboard/CurrentMonthDataCards";
import { MonthlyTrendData } from "@/types/dashboard/monthlyTrendData";
import { MonthlyTrendDataCard } from "./dashboard/MonthlyTrendDataCard";
import { EmotionPortfolioCard } from "./dashboard/EmotionPortfolioCard";
import { ExpenseAnalyseCard } from "./dashboard/ExpenseAnalyseCard";
import { WasteRankingCard } from "./dashboard/WasteRankingCard";
import { EmotionRankingCard } from "./dashboard/EmotionRankingCard";

//　今の日付の取得
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

export function DashboardContent() {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [monthIncomes, setMonthIncomes] = useState<MonthIncome[]>([]);
  const [monthExpenses, setMonthExpenses] = useState<MonthExpense[]>([]);
  const [monthNormalExpenses, setMonthNormalExpenses] = useState<
    MonthNormalExpense[]
  >([]);
  const [monthSpecialExpenses, setMonthSpecialExpenses] = useState<
    MonthSpecialExpense[]
  >([]);
  const [monthEmotionExpenses, setMonthEmotionExpenses] = useState<
    MonthEmotionExpense[]
  >([]);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<Expense[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const Data = await getDashboardData();
      setSavings(Data.savings);
      setMonthIncomes(Data.monthIncomes);
      setMonthExpenses(Data.monthExpenses);
      setMonthNormalExpenses(Data.monthNormalExpenses);
      setMonthSpecialExpenses(Data.monthSpecialExpenses);
      setMonthEmotionExpenses(Data.monthEmotionExpenses);
      setCurrentMonthExpenses(Data.currentMonthExpenses);
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

  // console.log("Savings:", savings);
  // console.log("Month Incomes:", monthIncomes);
  // console.log("Month Expenses:", monthExpenses);
  // console.log("Month Normal Category Expenses:", monthNormalExpenses);
  // console.log("Month Special Category Expenses:", monthSpecialExpenses);
  // console.log("Month Emotion Category Expenses:", monthEmotionExpenses);
  // console.log("Current Month Expenses:", currentMonthExpenses);

  // 今月の貯金額
  const currentSaving = getCurrentMonthData(savings);
  // 今月の収入
  const currentMonthIncome = getCurrentMonthData(monthIncomes);
  // 今月の支出
  const currentMonthExpense = getCurrentMonthData(monthExpenses);

  // 月次トレンドデータの生成（過去6ヶ月分）
  const monthlyTrendData = [];

  // 現在の月から過去6ヶ月分の月を生成
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;

    // 対応する月のデータを探す
    const expenseData = monthExpenses.find(
      (expense) => expense.year === targetYear && expense.month === targetMonth
    );

    // 対応する月の特別カテゴリー支出を取得
    const specialExpenses = monthSpecialExpenses.filter(
      (item) => item.year === targetYear && item.month === targetMonth
    );

    // 無駄遣いと自己投資の金額を計算
    const wasteExpense =
      specialExpenses.find((item) => item.specialCategoryName === "無駄遣い")
        ?.expenseTotal || 0;

    const selfInvestmentExpense =
      specialExpenses.find((item) => item.specialCategoryName === "自己投資")
        ?.expenseTotal || 0;

    monthlyTrendData.push({
      month: `${targetMonth}月`,
      ExpenseTotal: expenseData?.expenseTotal || 0,
      WasteTotal: wasteExpense,
      SelfInvestmentTotal: selfInvestmentExpense,
      総支出: expenseData?.expenseTotal || 0,
      無駄遣い: wasteExpense,
      自己投資: selfInvestmentExpense,
    });
  }

  // カテゴリー別支出データの生成
  const categoryExpenseData = monthNormalExpenses.map((expense) => ({
    name: expense.normalCategoryName,
    value: expense.expenseTotal,
    color:
      expense.normalCategoryColor ||
      `hsl(var(--chart-${(expense.normalCategoryId % 5) + 1}))`,
  }));

  // 今月の自己管理支出データの生成
  const specialExpenseData = monthSpecialExpenses
    .filter((item) => item.year === currentYear && item.month === currentMonth)
    .map((expense) => ({
      name: expense.specialCategoryName,
      value: expense.expenseTotal,
      color:
        expense.specialCategoryColor ||
        (expense.specialCategoryName === "無駄遣い"
          ? "hsl(346.8 77.2% 49.8%)"
          : expense.specialCategoryName === "自己投資"
          ? "hsl(142.1 76.2% 36.3%)"
          : "hsl(var(--chart-3))"),
    }));

  // 感情別支出データの生成
  const emotionExpenseData = monthEmotionExpenses.map((expense) => ({
    name: expense.emotionCategoryName,
    value: expense.expenseTotal,
    color:
      expense.emotionCategoryColor ||
      (expense.emotionCategoryName === "満足" ||
      expense.emotionCategoryName === "計画的"
        ? "hsl(142.1 76.2% 36.3%)"
        : expense.emotionCategoryName === "後悔" ||
          expense.emotionCategoryName === "衝動的"
        ? "hsl(346.8 77.2% 49.8%)"
        : `hsl(var(--chart-${(expense.emotionCategoryId % 5) + 1}))`),
  }));

  // 感情ポートフォリオデータの生成
  const emotionRadarData = monthEmotionExpenses.map((expense) => ({
    emotion: expense.emotionCategoryName,
    value: Math.min(100, Math.max(0, expense.expenseTotal / 1000)), // 0-100の範囲に正規化
  }));

  // 無駄遣いランキングデータの生成
  const wasteRankingData = currentMonthExpenses
    .filter((expense) => expense.specialCategoryName === "無駄遣い")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((expense) => ({
      name: expense.description || "無題の支出",
      amount: expense.amount,
      category: expense.normalCategoryName || "その他",
      date: new Date(expense.date).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
    }));

  // 感情ランキングデータの生成
  const emotionRankingData = currentMonthExpenses
    .filter(
      (expense) =>
        expense.emotionCategoryName === "衝動的" ||
        expense.emotionCategoryName === "後悔" ||
        expense.emotionCategoryName === "不満"
    )
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((expense) => ({
      name: expense.description || "無題の支出",
      amount: expense.amount,
      category: expense.normalCategoryName || "その他",
      date: new Date(expense.date).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <div className="conttainer">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-gray-600">資産状況の概要</p>
        </motion.div>

        <CurrentMonthDataCards
          currentSaving={currentSaving}
          currentMonthIncome={currentMonthIncome}
          currentMonthExpense={currentMonthExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SavingLineGraph savings={savings} />
          <MonthlyTrendDataCard monthlyTrendData={monthlyTrendData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionPortfolioCard emotionRadarData={emotionRadarData} />
          <ExpenseAnalyseCard
            categoryExpenseData={categoryExpenseData}
            specialExpenseData={specialExpenseData}
            emotionExpenseData={emotionExpenseData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WasteRankingCard wasteRankingData={wasteRankingData} />
          <EmotionRankingCard emotionRankingData={emotionRankingData} />
        </div>
      </div>
    </div>
  );
}
