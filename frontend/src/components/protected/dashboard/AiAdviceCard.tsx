"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { analyzeExpenses } from "@/api/controllers/aiAdviceController";

interface AiAdviceCardProps {
  advice?: {
    id: number;
    advice: string;
    advicedAt: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export function AiAdviceCard({ advice }: AiAdviceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 現在の日付を取得
  const today = new Date();

  let isAdviceFromToday = false;
  if (advice?.advicedAt) {
    // データベースから取得したUTC文字列をDateオブジェクトに変換
    const adviceDate = new Date(advice.advicedAt);
    console.log("アドバイスの日付:", adviceDate);
    console.log("今日の日付:", today);

    // ユーザーのローカルタイムゾーン（日本時間）で年月日を比較
    isAdviceFromToday =
      adviceDate.getFullYear() === today.getFullYear() &&
      adviceDate.getMonth() === today.getMonth() &&
      adviceDate.getDate() === today.getDate();
  }

  // AIで分析ボタンをクリックした時の処理
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeExpenses();
      if (result.success) {
        // 成功したらアドバイスを更新（親コンポーネントから渡される関数を使用）
        if (typeof window !== 'undefined') {
          // クライアントサイドでのみ実行
          const event = new CustomEvent('aiAdviceUpdated', { detail: result.advice });
          window.dispatchEvent(event);
        }
      } else {
        console.error("AI分析に失敗しました:", result.message);
        alert("AI分析に失敗しました。しばらく経ってからもう一度お試しください。");
      }
    } catch (error) {
      console.error("AI分析中にエラーが発生しました:", error);
      alert("AI分析中にエラーが発生しました。しばらく経ってからもう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center text-xl text-blue-700">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          AIアドバイス
        </CardTitle>
        <CardDescription>
          あなたの支出パターンに基づいた分析結果
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        {advice ? (
          <div className="space-y-4">
            <p className="text-gray-700 whitespace-pre-line">{advice.advice}</p>
            <p className="text-xs text-gray-500 mt-4">
            分析日: {advice.advicedAt
                ? new Date(advice.advicedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '不明'
              }
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              まだアドバイスがありません。AIに支出パターンを分析してもらいましょう。
            </p>
          </div>
        )}
      </CardContent>
      {!isAdviceFromToday && (
        <CardFooter className="flex justify-center pb-4">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "分析中..." : "AIで分析"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
