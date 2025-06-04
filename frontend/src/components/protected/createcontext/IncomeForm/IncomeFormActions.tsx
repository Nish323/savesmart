"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IncomeFormActionsProps {
  isLoading: boolean;
  onReset: () => void;
}

export function IncomeFormActions({
  isLoading,
  onReset
}: IncomeFormActionsProps) {
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
        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
      >
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
  );
}
