"use client";

import { Calculator } from "lucide-react";
import { SpecialCategory, EmotionCategory } from "@/types/form";
import { getColorText } from "../../../color/getColor";
import { getIconComponent } from "../../../Icon/GetIcon";

interface ExpenseSummaryProps {
  specialCategories: SpecialCategory[];
  emotionCategories: EmotionCategory[];
  totalBySpecial: Record<string, number>;
  totalByEmotion: Record<string, number>;
  total: number;
}

export function ExpenseSummary({
  specialCategories,
  emotionCategories,
  totalBySpecial,
  totalByEmotion,
  total,
}: ExpenseSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="font-semibold">特別カテゴリー別集計</h4>
          {specialCategories.map((special) => {
            const Icon = getIconComponent(special.icon);
            return (
              <div
                key={special.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${getColorText(special.color)}`} />
                  <span>{special.name}</span>
                </div>
                <span className="font-bold">
                  ¥{totalBySpecial[special.id] || 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">感情別集計</h4>
          {emotionCategories.map((emotion) => {
            const Icon = getIconComponent(emotion.icon);
            return (
              <div
                key={emotion.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${getColorText(emotion.color)}`} />
                  <span>{emotion.name}</span>
                </div>
                <span className="font-bold">
                  ¥{totalByEmotion[emotion.id] || 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-lg">
        <Calculator className="h-5 w-5" />
        <span>合計金額:</span>
        <span className="font-bold text-xl">¥{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
