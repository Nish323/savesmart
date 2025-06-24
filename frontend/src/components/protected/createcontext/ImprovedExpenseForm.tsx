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
import { Form, FormField } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { createExpense } from "@/api/controllers/expenseController";
import { DatePicker } from "./DatePicker";
import { ExpenseFormProps } from "@/types/form";
import { convertToHalfWidth } from "@/components/number/ConvertToHalfWidth";
import { formSchema } from "./Schema";
import { ExpenseItemForm } from "./ExpenseForm/ExpenseItemForm";
import { ExpenseSummary } from "./ExpenseForm/ExpenseSummary";
import { ExpenseFormActions } from "./ExpenseForm/ExpenseFormActions";

export function ImprovedExpenseForm({
  normalCategories,
  specialCategories,
  emotionCategories,
  onSuccess,
  defaultDate,
}: ExpenseFormProps) {
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

  const handleReset = () => {
    form.reset();
    setTotal(0);
    setTotalBySpecial({});
    setTotalByEmotion({});
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 各項目を個別に送信
      for (const item of values.items) {
        const halfWidthAmount = convertToHalfWidth(item.amount);
      // 日付をローカルタイムゾーンで処理
      const year = values.date.getFullYear();
      const month = values.date.getMonth() + 1;
      const day = values.date.getDate();
      // YYYY-MM-DD形式の文字列を作成
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      const expenseData = {
        amount: parseInt(halfWidthAmount),
        spentAt: formattedDate,
        normalCategoryId: parseInt(item.normalCategoryId),
        specialCategoryId: item.specialCategoryId
          ? parseInt(item.specialCategoryId)
          : null,
        emotionCategoryId: item.emotionCategoryId
          ? parseInt(item.emotionCategoryId)
          : null,
        memo: item.memo || values.memo || null,
        year: year,
        month: month,
        day: day,
        };

        await createExpense(expenseData as any);
      }

      onSuccess(`${values.items.length}件の支出を登録しました`);
      handleReset();
    } catch (error) {
      console.error("Error creating expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="lg:max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
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
              <div className="flex items-center justify-between md:flex-row flex-col gap-4">
                <h3 className="text-lg font-semibold">支出項目</h3>
                <div className="flex items-center gap-2">
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Zaimで追加
                  </Button>
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
              </div>

              {fields.map((field, index) => (
                <ExpenseItemForm
                  key={field.id}
                  form={form}
                  index={index}
                  normalCategories={normalCategories}
                  specialCategories={specialCategories}
                  emotionCategories={emotionCategories}
                  onRemove={() => {
                    remove(index);
                    calculateTotals();
                  }}
                  calculateTotals={calculateTotals}
                  isRemoveDisabled={fields.length === 1}
                />
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <ExpenseSummary
                specialCategories={specialCategories}
                emotionCategories={emotionCategories}
                totalBySpecial={totalBySpecial}
                totalByEmotion={totalByEmotion}
                total={total}
              />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-grow"></div>
                <ExpenseFormActions
                  isLoading={isLoading}
                  onReset={handleReset}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
