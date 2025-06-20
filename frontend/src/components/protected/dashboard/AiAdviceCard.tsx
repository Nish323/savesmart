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
    adviced_at: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export function AiAdviceCard({ advice }: AiAdviceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 現在の日付を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時間をリセット

  // アドバイスの作成日または更新日を取得
  const createdDate = advice?.created_at ? new Date(advice.created_at) : null;
  const updatedDate = advice?.updated_at ? new Date(advice.updated_at) : null;
  
  // 日付の比較用に時間をリセット
  if (createdDate) createdDate.setHours(0, 0, 0, 0);
  if (updatedDate) updatedDate.setHours(0, 0, 0, 0);

  // 作成日または更新日が今日かどうかをチェック
  const isCreatedToday = createdDate && createdDate.getTime() === today.getTime();
  const isUpdatedToday = updatedDate && updatedDate.getTime() === today.getTime();
  const isAdviceFromToday = isCreatedToday || isUpdatedToday;

  // AIで分析ボタンをクリックした時の処理
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      await analyzeExpenses();
      // 成功したら画面をリロード
      window.location.reload();
    } catch (error) {
      console.error("AI分析中にエラーが発生しました:", error);
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
              分析日: {new Date(advice.adviced_at).toLocaleDateString("ja-JP")}
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
