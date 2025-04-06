import { 
  LineChart, 
  Target, 
  Calendar,
  Bot,
  Smile,
  Clock,
  BarChart,
  PieChart
} from "lucide-react";

export const featuresData = [
  {
    title: "スマートな収支管理",
    description: "日々の収入と支出を簡単に記録。効率的な資産管理を実現します。",
    icon: LineChart
  },
  {
    title: "AI判定",
    description: "支出パターンを分析し、あなたの支出傾向を推測します。",
    icon: Bot
  },
  {
    title: "目標管理",
    description: "様々な目標設定によって、目標を楽しく達成できるようにアシストします。",
    icon: Target
  },
  {
    title: "感情ログ",
    description: "支出時の感情を記録し、お金の使い方と心理状態の関係を分析。より良い消費習慣の形成を支援します。",
    icon: Smile
  },
  {
    title: "定期支払い管理",
    description: "家賃やサブスクリプションなどの定期的な支出を自動記録。支払い忘れを防ぎます。",
    icon: Clock
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
];
