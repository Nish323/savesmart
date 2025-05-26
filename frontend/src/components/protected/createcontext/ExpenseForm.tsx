"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { TrendingDown, Plus } from "lucide-react";
import { createExpense } from "@/api/controllers/expenseController";
import { DatePicker } from "./DatePicker";
import { CategorySelect } from "./CategorySelect";
import { Category, SpecialCategory, EmotionCategory, ExpenseFormData } from "@/types/form";

const expenseFormSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください",
  }),
  amount: z.string().min(1, { message: "金額を入力してください" }),
  normalCategoryId: z.string().min(1, { message: "通常カテゴリーを選択してください" }),
  specialCategoryId: z.string().optional(),
  emotionCategoryId: z.string().optional(),
  memo: z.string().optional(),
});

interface ExpenseFormProps {
  normalCategories: Category[];
  specialCategories: SpecialCategory[];
  emotionCategories: EmotionCategory[];
  onSuccess: (message: string) => void;
  defaultDate?: Date;
}

export function ExpenseForm({
  normalCategories,
  specialCategories,
  emotionCategories,
  onSuccess,
  defaultDate,
}: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: defaultDate || new Date(),
      amount: "",
      normalCategoryId: "",
      specialCategoryId: "",
      emotionCategoryId: "",
      memo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof expenseFormSchema>) {
    setIsLoading(true);
    try {
      const expenseData = {
        amount: parseInt(values.amount),
        spentAt: values.date.toISOString().split('T')[0],
        normalCategoryId: parseInt(values.normalCategoryId),
        specialCategoryId: values.specialCategoryId ? parseInt(values.specialCategoryId) : null,
        emotionCategoryId: values.emotionCategoryId ? parseInt(values.emotionCategoryId) : null,
        memo: values.memo || null,
        year: values.date.getFullYear(),
        month: values.date.getMonth() + 1,
        day: values.date.getDate(),
      };

      await createExpense(expenseData as any);
      onSuccess('支出を登録しました');
      form.reset();
    } catch (error) {
      console.error('Error creating expense:', error);
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
        <CardDescription>
          支出の詳細を入力してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>金額</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ¥
                      </span>
                      <Input
                        type="number"
                        min="1"
                        className="pl-8"
                        placeholder="1000"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="normalCategoryId"
              render={({ field }) => (
                <CategorySelect
                  value={field.value}
                  onChange={field.onChange}
                  label="通常カテゴリー"
                  placeholder="カテゴリーを選択"
                  options={normalCategories}
                  required
                />
              )}
            />

            <FormField
              control={form.control}
              name="specialCategoryId"
              render={({ field }) => (
                <CategorySelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  label="特別カテゴリー"
                  placeholder="特別カテゴリーを選択"
                  options={specialCategories}
                />
              )}
            />

            <FormField
              control={form.control}
              name="emotionCategoryId"
              render={({ field }) => (
                <CategorySelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  label="感情カテゴリー"
                  placeholder="感情カテゴリーを選択"
                  options={emotionCategories}
                />
              )}
            />

            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ（任意）</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="備考や詳細な情報を入力"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "登録中..."
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    登録する
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
