"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { date } from "zod";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
}

export function DatePicker({ 
  value, 
  onChange, 
  label, 
  placeholder = "日付を選択" 
}: DatePickerProps) {
  // 日付選択時にローカルタイムゾーンの00:00:00に設定する
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // 選択された日付のローカルタイムゾーンの00:00:00を設定
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0
      );
      onChange(localDate);
    } else {
      onChange(date);
    }
  };

  // 初期値がUTC日付の場合、ローカルタイムゾーンに調整
  useEffect(() => {
    if (value) {
      // 現在の値がUTCで、日本時間で日付がずれている可能性があるため調整
      const currentLocalDate = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
        0, 0, 0
      );
      
      // 日付が異なる場合のみ更新（無限ループ防止）
      if (value.getDate() !== currentLocalDate.getDate()) {
        onChange(currentLocalDate);
      }
    }
  }, [value, onChange]);
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(value, "yyyy年MM月dd日")
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateChange}
            disabled={(date) =>
              date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
