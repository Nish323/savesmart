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
import { TrendingUp, Plus, Trash2, Calculator } from "lucide-react";
import { createIncome } from "@/api/controllers/incomeController";
import { DatePicker } from "./DatePicker";

const incomeItemSchema = z.object({
  amount: z.string().min(1, { message: "金額を入力してください" }),
  memo: z.string().optional(),
});

const formSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください",
  }),
  items: z.array(incomeItemSchema).min(1, { message: "最低1つの項目を入力してください" }),
  memo: z.string().optional(),
});

interface ImprovedIncomeFormProps {
  onSuccess: (message: string) => void;
  defaultDate?: Date;
}

export function ImprovedIncomeForm({ onSuccess, defaultDate }: ImprovedIncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate || new Date(),
      items: [{ amount: "", memo: "" }],
      memo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const calculateTotal = () => {
    const items = form.getValues("items");
    const sum = items.reduce((acc, item) => {
      const amount = parseInt(item.amount) || 0;
      return acc + amount;
    }, 0);
    setTotal(sum);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 各項目を個別に送信
      for (const item of values.items) {
        const incomeData = {
          amount: parseInt(item.amount),
          saved_at: values.date.toISOString().split('T')[0],
          memo: item.memo || "",
        };

        await createIncome(incomeData as any);
      }
      
      onSuccess(`${values.items.length}件の収入を登録しました`);
      form.reset();
      setTotal(0);
    } catch (error) {
      console.error('Error creating incomes:', error);
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
          複数の収入項目を一度に記録できます
        </CardDescription>
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
                <h3 className="text-lg font-semibold">収入項目</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ amount: "", memo: "" })}
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
                        <FormItem className="md:col-span-5">
                          <FormLabel className="text-xs">金額</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                              <Input
                                className="pl-8"
                                placeholder="50000"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  calculateTotal();
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
                      name={`items.${index}.memo`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-6">
                          <FormLabel className="text-xs">メモ</FormLabel>
                          <FormControl>
                            <Input placeholder="給与、賞与、副業など（任意）" {...field} />
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
                          calculateTotal();
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

            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  <span>合計金額:</span>
                  <span className="font-bold text-xl text-green-600">¥{total.toLocaleString()}</span>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() => {
                      form.reset();
                      setTotal(0);
                    }}
                  >
                    リセット
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none">
                    {isLoading ? (
                      "登録中..."
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        収入を記録
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
