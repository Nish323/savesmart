"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/protected/createcontext/DatePicker";
import {
  getExpenseById,
  updateExpense,
} from "@/api/controllers/expenseController";
import { Expense } from "@/types/expense";
import { convertToHalfWidth } from "@/components/number/ConvertToHalfWidth";
import { parseISO } from "date-fns/parseISO";
import { getIconComponent } from "@/components/Icon/GetIcon";
import { getColorText } from "@/components/color/getColor";

// 支出編集フォームのスキーマを定義
const formSchema = z.object({
  amount: z.string().min(1, { message: "金額を入力してください" }),
  date: z.date({
    required_error: "日付を選択してください",
  }),
  normalCategoryId: z
    .string()
    .min(1, { message: "通常カテゴリーを選択してください" }),
  specialCategoryId: z
    .string()
    .min(1, { message: "特別カテゴリーを選択してください" }),
  emotionCategoryId: z
    .string()
    .min(1, { message: "感情カテゴリーを選択してください" }),
  memo: z.string().optional(),
});

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: number | null;
  onSuccess: (message: string) => void;
  normalCategories: any[];
  specialCategories: any[];
  emotionCategories: any[];
  initialData?: any; // 初期データを追加
}

export function EditExpenseModal({
  isOpen,
  onClose,
  expenseId,
  onSuccess,
  normalCategories,
  specialCategories,
  emotionCategories,
  initialData,
}: EditExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      date: new Date(),
      normalCategoryId: "",
      specialCategoryId: "",
      emotionCategoryId: "",
      memo: "",
    },
  });

  // 支出データを取得して、フォームに設定する
  useEffect(() => {
    const setupForm = async () => {
      if (expenseId && isOpen) {
        try {
          setIsLoading(true);

          // 初期データを使用
          let data;
          if (initialData) {
            data = {
              amount: initialData.amount,
              spentAt: initialData.date.toISOString().split("T")[0],
              normalCategoryId: getNormalCategoryIdFromName(
                initialData.normalCategory
              ),
              specialCategoryId: getSpecialCategoryIdFromName(
                initialData.specialCategory
              ),
              emotionCategoryId: getEmotionCategoryIdFromName(
                initialData.emotionCategory
              ),
              memo:
                initialData.description !== "詳細なし"
                  ? initialData.description
                  : "",
            };
            setExpense(data as any);
          } else {
            // 初期データがない場合は処理を中止
            console.error("No initial data provided");
            setIsLoading(false);
            onClose();
            return;
          }

          // フォームの値を設定
          form.reset({
            amount: data.amount.toString(),
            date: data.spentAt
              ? typeof data.spentAt === "string"
                ? parseISO(data.spentAt)
                : data.spentAt
              : new Date(),
            normalCategoryId: data.normalCategoryId
              ? data.normalCategoryId.toString()
              : "",
            specialCategoryId: data.specialCategoryId
              ? data.specialCategoryId.toString()
              : specialCategories.length > 0 ? specialCategories[0].id.toString() : "",
            emotionCategoryId: data.emotionCategoryId
              ? data.emotionCategoryId.toString()
              : emotionCategories.length > 0 ? emotionCategories[0].id.toString() : "",
            memo: data.memo || "",
          });
        } catch (error) {
          console.error("Error setting up form:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    // カテゴリー名からIDを取得するヘルパー関数
    const getNormalCategoryIdFromName = (name: string | null): number => {
      if (!name) return 1; // デフォルト値
      const category = normalCategories.find((c) => c.name === name);
      return category ? category.id : 1;
    };

    const getSpecialCategoryIdFromName = (
      name: string | null
    ): number | null => {
      if (!name) return null;
      const category = specialCategories.find((c) => c.name === name);
      return category ? category.id : null;
    };

    const getEmotionCategoryIdFromName = (
      name: string | null
    ): number | null => {
      if (!name) return null;
      const category = emotionCategories.find((c) => c.name === name);
      return category ? category.id : null;
    };

    // デバッグ用にカテゴリー情報をコンソールに出力
    console.log("Normal Categories:", normalCategories);
    console.log("Special Categories:", specialCategories);
    console.log("Emotion Categories:", emotionCategories);
    if (initialData) {
      console.log("Initial Data:", initialData);
      console.log("Normal Category Name:", initialData.normalCategory);
      console.log(
        "Normal Category ID:",
        getNormalCategoryIdFromName(initialData.normalCategory)
      );
    }

    setupForm();
  }, [
    expenseId,
    isOpen,
    form,
    initialData,
    normalCategories,
    specialCategories,
    emotionCategories,
  ]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!expenseId) return;

    setIsLoading(true);
    try {
      // フォームの値をコンソールに出力（デバッグ用）
      console.log("Form values:", values);

      // 日付をローカルタイムゾーンで処理
      const year = values.date.getFullYear();
      const month = values.date.getMonth() + 1;
      const day = values.date.getDate();
      // YYYY-MM-DD形式の文字列を作成
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const halfWidthAmount = convertToHalfWidth(values.amount);
      const expenseData = {
        amount: parseInt(halfWidthAmount),
        spentAt: formattedDate,
        normalCategoryId: parseInt(values.normalCategoryId),
        specialCategoryId: parseInt(values.specialCategoryId),
        emotionCategoryId: parseInt(values.emotionCategoryId),
        memo: values.memo || null,
        year: year,
        month: month,
        day: day,
      };

      // 更新データをコンソールに出力（デバッグ用）
      console.log("Expense data to update:", expenseData);

      // 支出データを更新
      const result = await updateExpense(expenseId, expenseData);
      console.log("Update result:", result);
      
      onSuccess("支出を更新しました");
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>支出の編集</DialogTitle>
        </DialogHeader>

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
                    <Input
                      placeholder="金額を入力"
                      {...field}
                      onChange={(e) => {
                        const value = convertToHalfWidth(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="normalCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリー</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリーを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {normalCategories.map((category) => {
                        return (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            <div className="flex items-center gap-2">
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
              name="specialCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>特別カテゴリー</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="特別カテゴリーを選択" />
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
                              {Icon && (
                                <Icon
                                  className={`h-4 w-4 ${
                                    category.color
                                      ? getColorText(category.color)
                                      : "text-gray-500"
                                  }`}
                                />
                              )}
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
              name="emotionCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>感情カテゴリー</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="感情カテゴリーを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {emotionCategories.map((category) => {
                        const Icon = getIconComponent(category.icon);
                        return (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              {Icon && (
                                <Icon
                                  className={`h-4 w-4 ${
                                    category.color
                                      ? getColorText(category.color)
                                      : "text-gray-500"
                                  }`}
                                />
                              )}
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
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ（任意）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="メモを入力"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-900"
              >
                {isLoading ? "更新中..." : "更新する"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
