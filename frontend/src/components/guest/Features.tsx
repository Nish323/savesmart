"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Receipt, 
  LineChart, 
  Target, 
  Calendar,
  Bot,
  Camera,
  Smile,
  TrendingUp,
  Clock,
  MessageSquare,
  BarChart,
  PieChart
} from "lucide-react";

const features = [
  {
    title: "スマートな収支管理",
    description: "日々の収入と支出を簡単に記録。カテゴリー分類で支出を可視化し、効率的な資産管理を実現します。",
    icon: LineChart
  },
  {
    title: "AIアシスタント",
    description: "支出パターンを分析し、予算管理のアドバイスを提供。あなたの貯金目標達成をサポートします。",
    icon: Bot
  },
  {
    title: "レシートOCR機能",
    description: "レシートを撮影するだけで自動的に支出を記録。手入力の手間を大幅に削減します。",
    icon: Camera
  },
  {
    title: "目標管理",
    description: "月間・年間の貯金目標を設定し、視覚的な進捗管理で達成をサポート。目標達成時には通知でお祝いします。",
    icon: Target
  },
  {
    title: "感情ログ",
    description: "支出時の感情を記録し、お金の使い方と心理状態の関係を分析。より良い消費習慣の形成を支援します。",
    icon: Smile
  },
  {
    title: "将来予測",
    description: "現在の支出パターンに基づく将来予測と、支出調整によるシミュレーションで長期的な資産形成をサポート。",
    icon: TrendingUp
  },
  {
    title: "定期支払い管理",
    description: "家賃やサブスクリプションなどの定期的な支出を自動記録。支払い忘れを防ぎます。",
    icon: Clock
  },
  {
    title: "LINEbot連携",
    description: "LINEでレシートを送信するだけで支出を仮登録。スマートフォンならではの手軽さを実現します。",
    icon: MessageSquare
  },
  {
    title: "支出分析ダッシュボード",
    description: "支出状況、感情ログ、ランキングなどを一目で確認できる直感的なダッシュボード。",
    icon: BarChart
  },
  {
    title: "カレンダービュー",
    description: "日々の支出をカレンダー形式で表示。支出パターンを視覚的に把握できます。",
    icon: Calendar
  },
  {
    title: "カテゴリー分析",
    description: "支出を重み付けカテゴリーで分類。無駄遣い度を可視化し、支出の最適化を支援します。",
    icon: PieChart
  },
  {
    title: "レシート管理",
    description: "撮影したレシートをデジタル保管。必要な時にすぐに確認できます。",
    icon: Receipt
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">主な機能</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            SaveSmartの豊富な機能で、より賢い資産管理を実現します。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}