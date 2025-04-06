"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Target, PiggyBank, TrendingUp, Bell } from "lucide-react";
import {
  GuideHeader,
  GuideItem,
  CircularIcon,
  TabCard
} from "@/components/guest/guide-content";

export function GuideContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <GuideHeader />

        <Tabs defaultValue="start" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="start">はじめに</TabsTrigger>
            <TabsTrigger value="goals">目標設定</TabsTrigger>
            <TabsTrigger value="track">進捗管理</TabsTrigger>
            <TabsTrigger value="tips">活用のコツ</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <TabCard 
              title="SaveSmartを始めよう" 
              description="基本的な使い方をご紹介します"
            >
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="アカウントを作成"
                description="メールアドレスで簡単に登録できます。"
              />
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="プロフィールを編集"
                description="プロフィールを編集することで、モチベーションを上げましょう。"
              />
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="定期払いの登録"
                description="定期的な支払いを登録することで、簡単に支出を管理できます。"
              />
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="時給を登録"
                description="時給を登録することで、より無駄遣いを可視化できます。"
              />
            </TabCard>
          </TabsContent>

          <TabsContent value="goals">
            <TabCard 
              title="目標を設定する" 
              description="効果的な目標設定の方法"
            >
              <GuideItem 
                icon={<Target className="h-6 w-6 text-primary flex-shrink-0" />}
                title="具体的な目標を立てる"
                description="目標設定を行い、貯金を継続的に行えるようにしましょう。"
              />
              <GuideItem 
                icon={<PiggyBank className="h-6 w-6 text-primary flex-shrink-0" />}
                title="簡単な目標を立てる"
                description="小さいがくから目標を立て、少しずつ貯金していきましょう。"
              />
            </TabCard>
          </TabsContent>

          <TabsContent value="track">
            <TabCard 
              title="進捗を管理する" 
              description="資産の成長を確認"
            >
              <GuideItem 
                icon={<TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />}
                title="グラフで確認"
                description="視覚的に分かりやすく資産の成長を確認できます。"
              />
            </TabCard>
          </TabsContent>

          <TabsContent value="tips">
            <TabCard 
              title="活用のコツ" 
              description="より効果的な資産形成のために"
            >
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="定期的な見直し"
                description="月1回は目標と進捗を見直しましょう。"
              />
              <GuideItem 
                icon={<CircularIcon><ChevronRight className="h-6 w-6 text-primary" /></CircularIcon>}
                title="データの活用"
                description="分析機能を活用して、より効果的な資産形成を目指しましょう。"
              />
            </TabCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
