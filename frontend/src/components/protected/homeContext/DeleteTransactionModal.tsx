"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getColorBackGround } from "@/components/color/getColor";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";
import { deleteExpense } from "@/api/controllers/expenseController";
import { deleteIncome } from "@/api/controllers/incomeController";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ExpenseAndIncomeTransaction;
  onSuccess?: () => void;
}

export function DeleteTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: DeleteTransactionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (transaction.type === "expense") {
        await deleteExpense(transaction.id);
      } else {
        await deleteIncome(transaction.id);
      }
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction.type === "expense" ? "支出" : "収入"}の削除
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="font-medium">日付</div>
            <div className="p-2 bg-gray-50 rounded-md">
              {format(transaction.date, "yyyy年MM月dd日")}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">金額</div>
            <div className="p-2 bg-gray-50 rounded-md">
              ¥{transaction.amount.toLocaleString()}
            </div>
          </div>

          {transaction.type === "expense" && (
            <>
              {transaction.normalCategory && (
                <div className="space-y-2">
                  <div className="font-medium">カテゴリー</div>
                  <div className="p-2 bg-gray-50 rounded-md flex items-center">
                    <Badge
                      className={`${getColorBackGround(
                        transaction.normalCategoryColor
                      )} text-white whitespace-nowrap text-xs mr-2`}
                      variant="destructive"
                    >
                      {transaction.normalCategory}
                    </Badge>
                  </div>
                </div>
              )}

              {transaction.specialCategory && (
                <div className="space-y-2">
                  <div className="font-medium">特別カテゴリー</div>
                  <div className="p-2 bg-gray-50 rounded-md flex items-center">
                    <Badge
                      className={`${getColorBackGround(
                        transaction.specialCategoryColor
                      )} text-white whitespace-nowrap text-xs mr-2`}
                      variant="destructive"
                    >
                      {transaction.specialCategory}
                    </Badge>
                  </div>
                </div>
              )}

              {transaction.emotionCategory && (
                <div className="space-y-2">
                  <div className="font-medium">感情カテゴリー</div>
                  <div className="p-2 bg-gray-50 rounded-md flex items-center">
                    <Badge
                      className={`${getColorBackGround(
                        transaction.emotionCategoryColor
                      )} text-white whitespace-nowrap text-xs mr-2`}
                      variant="destructive"
                    >
                      {transaction.emotionCategory}
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <div className="font-medium">メモ</div>
            <div className="p-2 bg-gray-50 rounded-md">
              {transaction.description || "詳細なし"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-red-600">
              この{transaction.type === "expense" ? "支出" : "収入"}
              を削除してもよろしいですか？
            </div>
            <div className="text-sm text-gray-500">
              削除すると、このデータは完全に削除され、復元できません。
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "削除中..." : "削除する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
