// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, BarChart, PieChart, Wallet, TrendingUp, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
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
  ComposedChart
} from 'recharts';
import { NormalCategory, SpecialCategory, EmotionCategory } from "@/types/category";
import { MonthIncome, MonthExpensen, MonthNormalExpense, MonthSpecialExpense, MonthEmotionExpense } from "@/types/monthTransactions"; 
import { getColorBackGround, getColorText } from "../color/getColor";

// 資産推移のサンプルデータ
const assetData = [
  { month: '10月', amount: 1200000 },
  { month: '11月', amount: 1350000 },
  { month: '12月', amount: 1280000 },
  { month: '1月', amount: 1450000 },
  { month: '2月', amount: 1520000 },
  { month: '3月', amount: 1680000 },
];

// カテゴリー別支出データ
const categoryExpenseData = [
  { name: '食費', value: 45000, color: 'hsl(var(--chart-1))' },
  { name: '住居費', value: 85000, color: 'hsl(var(--chart-2))' },
  { name: '交通費', value: 12000, color: 'hsl(var(--chart-3))' },
  { name: '娯楽費', value: 25000, color: 'hsl(var(--chart-4))' },
  { name: 'その他', value: 18000, color: 'hsl(var(--chart-5))' },
];

// 重み付け別支出データ
const specialExpenseData = [
  { name: '無駄遣い', value: 28000, color: 'hsl(346.8 77.2% 49.8%)' },
  { name: '自己投資', value: 65000, color: 'hsl(142.1 76.2% 36.3%)' },
  { name: '通常支出', value: 92000, color: 'hsl(var(--chart-3))' },
];

// 感情別支出データ
const emotionExpenseData = [
  { name: '満足', value: 42000, color: 'hsl(142.1 76.2% 36.3%)' },
  { name: '後悔', value: 28000, color: 'hsl(346.8 77.2% 49.8%)' },
  { name: '衝動的', value: 35000, color: 'hsl(var(--chart-1))' },
  { name: '計画的', value: 80000, color: 'hsl(var(--chart-2))' },
];

// 感情ポートフォリオデータ
const emotionRadarData = [
  { emotion: '満足', value: 80 },
  { emotion: '後悔', value: 30 },
  { emotion: '衝動', value: 60 },
  { emotion: '不満', value: 45 },
  { emotion: '計画的', value: 70 },
];

// 支出習慣の時系列変化データ
const monthlyTrendData = [
  { month: '1月', 総支出: 80000, 無駄遣い: 20000, 自己投資: 10000 },
  { month: '2月', 総支出: 75000, 無駄遣い: 15000, 自己投資: 12000 },
  { month: '3月', 総支出: 90000, 無駄遣い: 18000, 自己投資: 15000 },
  { month: '4月', 総支出: 70000, 無駄遣い: 10000, 自己投資: 9000 },
  { month: '5月', 総支出: 85000, 無駄遣い: 12000, 自己投資: 8000 },
];

// 無駄遣いランキングデータ
const wasteRankingData = [
  { name: '飲み会', amount: 15000, category: '娯楽費', date: '3/15' },
  { name: '衝動買いのガジェット', amount: 12000, category: '買い物', date: '3/10' },
  { name: '使っていない定額サービス', amount: 8000, category: 'その他', date: '3/1' },
  { name: 'タクシー', amount: 5000, category: '交通費', date: '3/8' },
  { name: '食べ残し', amount: 3000, category: '食費', date: '3/12' },
];

// 最近の取引のサンプルデータ
const recentTransactions = [
  { date: '3/15', type: 'expense', category: '食費', amount: -3000 },
  { date: '3/15', type: 'income', category: '給与', amount: 280000 },
  { date: '3/14', type: 'expense', category: '交通費', amount: -500 },
  { date: '3/14', type: 'expense', category: '娯楽費', amount: -5000 },
  { date: '3/13', type: 'expense', category: '食費', amount: -1200 },
];

export function DashboardContent() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: "総資産", value: "¥1,680,000", icon: Wallet, trend: "+9.5%", trendUp: true },
            { title: "今月の収入", value: "¥320,000", icon: ArrowUp, trend: "+2.1%", trendUp: true },
            { title: "今月の支出", value: "¥185,000", icon: ArrowDown, trend: "-1.5%", trendUp: false },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                      <p className={`text-sm mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend}
                      </p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  資産推移
                </CardTitle>
                <CardDescription>過去6ヶ月の資産推移</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={assetData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelStyle={{ color: 'black' }}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
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
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  支出習慣の時系列変化
                </CardTitle>
                <CardDescription>月別の支出パターン分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrendData}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="総支出" barSize={20} fill="#ccc" />
                      <Line 
                        type="monotone" 
                        dataKey="無駄遣い" 
                        stroke="hsl(346.8 77.2% 49.8%)" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="自己投資" 
                        stroke="hsl(142.1 76.2% 36.3%)" 
                        strokeWidth={2} 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  感情ポートフォリオ
                </CardTitle>
                <CardDescription>支出に関連する感情の分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={emotionRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="emotion" />
                      <Radar 
                        name="感情" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  支出分析
                </CardTitle>
                <CardDescription>今月の支出内訳</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="category" className="mb-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="category">カテゴリー別</TabsTrigger>
                    <TabsTrigger value="weight">重み付け別</TabsTrigger>
                    <TabsTrigger value="emotion">感情別</TabsTrigger>
                  </TabsList>
                  <TabsContent value="category">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryExpenseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryExpenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => `¥${value.toLocaleString()}`}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="weight">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={specialExpenseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {specialExpenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => `¥${value.toLocaleString()}`}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="emotion">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={emotionExpenseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {emotionExpenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => `¥${value.toLocaleString()}`}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  今月の無駄遣いランキング
                </CardTitle>
                <CardDescription>無駄遣いと判断された支出のトップ5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteRankingData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-red-500">¥{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  最近の取引
                </CardTitle>
                <CardDescription>直近の収支記録</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={recentTransactions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `¥${Math.abs(value).toLocaleString()}`}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="amount" fill="hsl(var(--primary))">
                        {recentTransactions.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.type === 'income' ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(346.8 77.2% 49.8%)'}
                          />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
