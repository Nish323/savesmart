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
import { TrendingUp, Plus } from "lucide-react";
import { createIncome } from "@/api/controllers/incomeController";
import { DatePicker } from "./DatePicker";
import { IncomeFormData } from "@/types/form";

const incomeFormSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください",
  }),
  income: z.string().min(1, { message: "収入額を入力してください" }),
});

interface IncomeFormProps {
  onSuccess: (message: string) => void;
  defaultDate?: Date;
}

export function IncomeForm({ onSuccess, defaultDate }: IncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      date: defaultDate || new Date(),
      income: "",
    },
  });

  async function onSubmit(values: z.infer<typeof incomeFormSchema>) {
    setIsLoading(true);
    try {
      const incomeData = {
        income: parseInt(values.income),
        savedAt: values.date.toISOString().split('T')[0],
      };

      await createIncome(incomeData as any);
      onSuccess('収入を登録しました');
      form.reset();
    } catch (error) {
      console.error('Error creating income:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          収入を記録
        </CardTitle>
        <CardDescription>
          収入の詳細を入力してください
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
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>収入額</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ¥
                      </span>
                      <Input
                        type="number"
                        min="1"
                        className="pl-8"
                        placeholder="50000"
                        {...field}
                      />
                    </div>
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
