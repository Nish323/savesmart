"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ExpenseFormActionsProps {
  isLoading: boolean;
  onReset: () => void;
}

export function ExpenseFormActions({
  isLoading,
  onReset
}: ExpenseFormActionsProps) {
  return (
    <div className="flex gap-4 w-full md:w-auto">
      <Button
        type="button"
        variant="outline"
        className="flex-1 md:flex-none"
        onClick={onReset}
      >
        リセット
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 md:flex-none"
      >
        {isLoading ? (
          "登録中..."
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            支出を記録
          </>
        )}
      </Button>
    </div>
  );
}
