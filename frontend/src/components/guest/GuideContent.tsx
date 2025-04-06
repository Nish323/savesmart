"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Target, PiggyBank, TrendingUp, Bell } from "lucide-react";

export function GuideContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">SaveSmartの使い方</h1>
          <p className="text-xl text-gray-600">
            SaveSmartの基本的な機能と使い方をご紹介します。
          </p>
        </motion.div>

        <Tabs defaultValue="start" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="start">はじめに</TabsTrigger>
            <TabsTrigger value="goals">目標設定</TabsTrigger>
            <TabsTrigger value="track">進捗管理</TabsTrigger>
            <TabsTrigger value="tips">活用のコツ</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <Card>
              <CardHeader>
                <CardTitle>SaveSmartを始めよう</CardTitle>
                <CardDescription>基本的な使い方をご紹介します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">アカウントを作成</h3>
                    <p className="text-gray-600">メールアドレスで簡単に登録できます。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">目標を設定</h3>
                    <p className="text-gray-600">あなたの目標に合わせて資産形成プランを設定します。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">資産を管理</h3>
                    <p className="text-gray-600">直感的なインターフェースで簡単に資産を管理できます。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>目標を設定する</CardTitle>
                <CardDescription>効果的な目標設定の方法</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Target className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">具体的な目標を立てる</h3>
                    <p className="text-gray-600">達成したい金額と期間を具体的に設定しましょう。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PiggyBank className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">資産形成プランを選択</h3>
                    <p className="text-gray-600">あなたの生活スタイルに合わせた資産形成プランを選びましょう。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track">
            <Card>
              <CardHeader>
                <CardTitle>進捗を管理する</CardTitle>
                <CardDescription>資産の成長を確認</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">グラフで確認</h3>
                    <p className="text-gray-600">視覚的に分かりやすく資産の成長を確認できます。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bell className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">通知設定</h3>
                    <p className="text-gray-600">目標達成に向けた通知を設定できます。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader>
                <CardTitle>活用のコツ</CardTitle>
                <CardDescription>より効果的な資産形成のために</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">定期的な見直し</h3>
                    <p className="text-gray-600">月1回は目標と進捗を見直しましょう。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">データの活用</h3>
                    <p className="text-gray-600">分析機能を活用して、より効果的な資産形成を目指しましょう。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}