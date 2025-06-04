"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingDown,
  Plus,
  Trash2,
  Calculator,
  TriangleAlert,
  Rocket,
  CircleDot,
  Smile,
  Frown,
  Zap,
  Target,
} from "lucide-react";
import { createExpense } from "@/api/controllers/expenseController";
import { DatePicker } from "./DatePicker";
import { Category, SpecialCategory, EmotionCategory } from "@/types/form";
import { getColorText } from "../../color/getColor";
import { getIconComponent } from "../../Icon/GetIcon";

const expenseItemSchema = z.object({
  amount: z.string().min(1, { message: "金額を入力してください" }),
  normalCategoryId: z
    .string()
    .min(1, { message: "通常カテゴリーを選択してください" }),
  specialCategoryId: z
    .string()
    .min(1, { message: "特別カテゴリーを選択してください" }),
  emotionCategoryId: z
    .string()
    .min(1, { message: "感情カテゴリーを選択してください" }),
  weight: z.string().min(1, { message: "重み付けを選択してください" }),
  emotion: z.string().min(1, { message: "感情を選択してください" }),
  memo: z.string().optional(),
});

const formSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください",
  }),
  items: z
    .array(expenseItemSchema)
    .min(1, { message: "最低1つの項目を入力してください" }),
  memo: z.string().optional(),
});

interface ImprovedExpenseFormProps {
  normalCategories: Category[];
  specialCategories: SpecialCategory[];
  emotionCategories: EmotionCategory[];
  onSuccess: (message: string) => void;
  defaultDate?: Date;
}

export function ImprovedExpenseForm({
  normalCategories,
  specialCategories,
  emotionCategories,
  onSuccess,
  defaultDate,
}: ImprovedExpenseFormProps) {
  // 全角数字を半角数字に変換する関数
  const convertToHalfWidth = (str: string): string => {
    return str.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [totalBySpecial, setTotalBySpecial] = useState<Record<string, number>>(
    {}
  );
  const [totalByEmotion, setTotalByEmotion] = useState<Record<string, number>>(
    {}
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate || new Date(),
      items: [
        {
          amount: "",
          normalCategoryId: "",
          specialCategoryId: "",
          emotionCategoryId: "",
          weight: "normal",
          emotion: "planned",
          memo: "",
        },
      ],
      memo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const calculateTotals = () => {
    const items = form.getValues("items");
    const sum = items.reduce((acc, item) => {
      const halfWidthAmount = convertToHalfWidth(item.amount);
      const amount = parseInt(halfWidthAmount) || 0;
      return acc + amount;
    }, 0);

    const specialTotals = items.reduce((acc, item) => {
      const halfWidthAmount = convertToHalfWidth(item.amount);
      const amount = parseInt(halfWidthAmount) || 0;
      const specialId = item.specialCategoryId;
      if (specialId) {
        acc[specialId] = (acc[specialId] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const emotionTotals = items.reduce((acc, item) => {
      const halfWidthAmount = convertToHalfWidth(item.amount);
      const amount = parseInt(halfWidthAmount) || 0;
      const emotionId = item.emotionCategoryId;
      if (emotionId) {
        acc[emotionId] = (acc[emotionId] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    setTotal(sum);
    setTotalBySpecial(specialTotals);
    setTotalByEmotion(emotionTotals);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 各項目を個別に送信
      for (const item of values.items) {
        const halfWidthAmount = convertToHalfWidth(item.amount);
        const expenseData = {
          amount: parseInt(halfWidthAmount),
          spentAt: values.date.toISOString().split("T")[0],
          normalCategoryId: parseInt(item.normalCategoryId),
          specialCategoryId: item.specialCategoryId
            ? parseInt(item.specialCategoryId)
            : null,
          emotionCategoryId: item.emotionCategoryId
            ? parseInt(item.emotionCategoryId)
            : null,
          memo: item.memo || values.memo || null,
          year: values.date.getFullYear(),
          month: values.date.getMonth() + 1,
          day: values.date.getDate(),
        };

        await createExpense(expenseData as any);
      }

      onSuccess(`${values.items.length}件の支出を登録しました`);
      form.reset();
      setTotal(0);
      setTotalBySpecial({});
      setTotalByEmotion({});
    } catch (error) {
      console.error("Error creating expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          支出を記録
        </CardTitle>
        <CardDescription>複数の支出項目を一度に記録できます</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  label="日付"
                />
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">支出項目</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      amount: "",
                      normalCategoryId: "",
                      specialCategoryId: "",
                      emotionCategoryId: "",
                      weight: "normal",
                      emotion: "planned",
                      memo: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  項目を追加
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  {/* モバイル: 縦並び、デスクトップ: グリッド */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">金額</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ¥
                              </span>
                              <Input
                                className="pl-8"
                                placeholder="1000"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  calculateTotals();
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.normalCategoryId`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">
                            通常カテゴリー
                          </FormLabel>
                          <Select
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              calculateTotals();
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {normalCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.specialCategoryId`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">
                            特別カテゴリー
                          </FormLabel>
                          <Select
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              calculateTotals();
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialCategories.map((category) => {
                                const Icon = getIconComponent(category.icon);
                                return (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        className={`h-4 w-4 ${getColorText(
                                          category.color
                                        )}`}
                                      />
                                      {category.name}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.emotionCategoryId`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs">
                            感情カテゴリー
                          </FormLabel>
                          <Select
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              calculateTotals();
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {emotionCategories.map((emotion) => {
                                const Icon = getIconComponent(emotion.icon);
                                return (
                                  <SelectItem
                                    key={emotion.id}
                                    value={emotion.id.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        className={`h-4 w-4 ${getColorText(
                                          emotion.color
                                        )}`}
                                      />
                                      {emotion.name}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.memo`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel className="text-xs">メモ</FormLabel>
                          <FormControl>
                            <Input placeholder="詳細（任意）" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => {
                          remove(index);
                          calculateTotals();
                        }}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
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
                          <Icon
                            className={`h-5 w-5 ${getColorText(special.color)}`}
                          />
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
                          <Icon
                            className={`h-5 w-5 ${getColorText(emotion.color)}`}
                          />
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

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  <span>合計金額:</span>
                  <span className="font-bold text-xl">
                    ¥{total.toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() => {
                      form.reset();
                      setTotal(0);
                      setTotalBySpecial({});
                      setTotalByEmotion({});
                    }}
                  >
                    リセット
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 md:flex-none"
                  >
                    {isLoading ? (
                      "登録中..."
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        支出を記録
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
