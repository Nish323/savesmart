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
import { DatePicker } from "@/components/protected/createcontext/DatePicker";
import {
  getIncomeById,
  updateIncome,
} from "@/api/controllers/incomeController";
import { Income } from "@/types/income";
import { convertToHalfWidth } from "@/components/number/ConvertToHalfWidth";
import { parseISO } from "date-fns/parseISO";
import { CustomOverlay } from "@/components/ui/custum-overlay";

// 収入編集フォームのスキーマを定義
const formSchema = z.object({
  amount: z.string().min(1, { message: "金額を入力してください" }),
  date: z.date({
    required_error: "日付を選択してください",
  }),
  memo: z.string().optional(),
});

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomeId: number | null;
  onSuccess: (message: string) => void;
  initialData?: any; // 初期データを追加
}

export function EditIncomeModal({
  isOpen,
  onClose,
  incomeId,
  onSuccess,
  initialData,
}: EditIncomeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [income, setIncome] = useState<Income | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      date: new Date(),
      memo: "",
    },
  });

  // 収入データを取得して、フォームに設定する
  useEffect(() => {
    const setupForm = async () => {
      if (incomeId && isOpen) {
        try {
          setIsLoading(true);

          // APIからデータを取得
          let data;
          try {
            // APIから収入データを取得
            data = await getIncomeById(incomeId);
            console.log("Fetched income data:", data);
            setIncome(data);
          } catch (error) {
            console.error("Error fetching income data:", error);

            // APIからの取得に失敗した場合は初期データを使用
            if (initialData) {
              console.log("Using initial data instead:", initialData);
              data = {
                income: initialData.amount,
                amount: initialData.amount,
                savedAt: initialData.date.toISOString().split("T")[0],
                saved_at: initialData.date.toISOString().split("T")[0],
                memo:
                  initialData.description !== "詳細なし"
                    ? initialData.description
                    : "",
              };
              setIncome(data as any);
            } else {
              // 初期データがない場合は処理を中止
              console.error("No data available");
              setIsLoading(false);
              onClose();
              return;
            }
          }

          // フォームの値を設定
          form.reset({
            amount: data.amount ? data.amount.toString() : "",
            date: data.savedAt
              ? typeof data.savedAt === "string"
                ? parseISO(data.savedAt)
                : data.savedAt
              : new Date(),
            memo: data.memo || data.description || "",
          });
        } catch (error) {
          console.error("Error setting up form:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    setupForm();
  }, [incomeId, isOpen, form, initialData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!incomeId) return;

    setIsLoading(true);
    try {
      // 日付をローカルタイムゾーンで処理
      const year = values.date.getFullYear();
      const month = values.date.getMonth() + 1;
      const day = values.date.getDate();
      // YYYY-MM-DD形式の文字列を作成
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const halfWidthAmount = convertToHalfWidth(values.amount);
      const incomeData = {
        amount: parseInt(halfWidthAmount),
        saved_at: formattedDate,
        memo: values.memo || "",
        year: year,
        month: month,
        day: day,
      };

      // 収入データを更新
      const result = await updateIncome(incomeId, incomeData);
      console.log("Update result:", result);
      const message = "収入を更新しました";
      onSuccess(message);
      onClose();
    } catch (error) {
      onSuccess("収入の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      {isOpen && <CustomOverlay />}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>収入の編集</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <DatePicker
                      label="日付を選択"
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 金額のFormField */}
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

            {/* メモのFormField */}
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

            {/* フッター（送信ボタンなど） */}
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
