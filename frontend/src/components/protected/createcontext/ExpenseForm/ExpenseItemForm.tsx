"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Category, SpecialCategory, EmotionCategory } from "@/types/form";
import { getColorText } from "../../../color/getColor";
import { getIconComponent } from "../../../Icon/GetIcon";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../Schema";

interface ExpenseItemFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  index: number;
  normalCategories: Category[];
  specialCategories: SpecialCategory[];
  emotionCategories: EmotionCategory[];
  onRemove: () => void;
  calculateTotals: () => void;
  isRemoveDisabled: boolean;
}

export function ExpenseItemForm({
  form,
  index,
  normalCategories,
  specialCategories,
  emotionCategories,
  onRemove,
  calculateTotals,
  isRemoveDisabled,
}: ExpenseItemFormProps) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
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
              <FormLabel className="text-xs">通常カテゴリー</FormLabel>
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
              <FormLabel className="text-xs">特別カテゴリー</FormLabel>
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
              <FormLabel className="text-xs">感情カテゴリー</FormLabel>
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
                            className={`h-4 w-4 ${getColorText(emotion.color)}`}
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
