"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

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

interface IncomeItemFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  index: number;
  onRemove: () => void;
  calculateTotal: () => void;
  isRemoveDisabled: boolean;
}

export function IncomeItemForm({
  form,
  index,
  onRemove,
  calculateTotal,
  isRemoveDisabled
}: IncomeItemFormProps) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
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
            onClick={onRemove}
            disabled={isRemoveDisabled}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
