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
import { TrendingUp, Plus } from "lucide-react";
import { createIncome } from "@/api/controllers/incomeController";
import { DatePicker } from "./DatePicker";
import { convertToHalfWidth } from "@/components/number/ConvertToHalfWidth";
import { IncomeItemForm } from "./IncomeItemForm";
import { IncomeSummary } from "./IncomeSummary";
import { IncomeFormActions } from "./IncomeFormActions";

// 収入フォームのスキーマを定義
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
      const halfWidthAmount = convertToHalfWidth(item.amount);
      const amount = parseInt(halfWidthAmount) || 0;
      return acc + amount;
    }, 0);
    setTotal(sum);
  };

  const handleReset = () => {
    form.reset();
    setTotal(0);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 各項目を個別に送信
      for (const item of values.items) {
        const halfWidthAmount = convertToHalfWidth(item.amount);
        const incomeData = {
          amount: parseInt(halfWidthAmount),
          saved_at: values.date.toISOString().split('T')[0],
          memo: item.memo || "",
        };

        await createIncome(incomeData as any);
      }
      
      onSuccess(`${values.items.length}件の収入を登録しました`);
      handleReset();
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
                <IncomeItemForm
                  key={field.id}
                  form={form}
                  index={index}
                  onRemove={() => {
                    remove(index);
                    calculateTotal();
                  }}
                  calculateTotal={calculateTotal}
                  isRemoveDisabled={fields.length === 1}
                />
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <IncomeSummary total={total} />

                <IncomeFormActions
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
