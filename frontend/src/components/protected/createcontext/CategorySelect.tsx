"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryOption {
  id: number;
  name: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  options: CategoryOption[];
  required?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  label,
  placeholder,
  options,
  required = false,
}: CategorySelectProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {!required}
      </FormLabel>
      <Select onValueChange={onChange} defaultValue={value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
