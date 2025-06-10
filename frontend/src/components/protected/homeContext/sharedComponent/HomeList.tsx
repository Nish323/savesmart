import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getColorBackGround } from "@/components/color/getColor";
import { TrendingDown, TrendingUp, Pencil } from "lucide-react";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteTransactionModal } from "../DeleteTransactionModal";

interface HomeListProps {
  transaction: ExpenseAndIncomeTransaction;
  showDate?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function HomeList({
  transaction,
  showDate = false,
  onEditClick,
  onDeleteClick,
}: HomeListProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
      {/*アイコンと金額*/}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {transaction.type === "expense" ? (
            <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
          ) : (
            <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
          <span className="font-medium">
            ¥{transaction.amount.toLocaleString()}
          </span>
        </div>

        {/*説明と日付*/}
        <div className="text-sm text-gray-500 mt-1">
          {showDate && (
            <span className="mr-2 whitespace-nowrap">
              {format(transaction.date, "yyyy年MM月dd日")}
            </span>
          )}
          <span className="break-words">{transaction.description}</span>
        </div>
      </div>

      {/*カテゴリーと編集ボタン*/}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        {transaction.type === "expense" && (
          <>
            {transaction.normalCategory && (
              <Badge
                className={`${getColorBackGround(
                  transaction.normalCategoryColor
                )} text-white whitespace-nowrap text-xs`}
                variant="destructive"
              >
                {transaction.normalCategory}
              </Badge>
            )}
            {transaction.specialCategory && (
              <Badge
                className={`${getColorBackGround(
                  transaction.specialCategoryColor
                )} text-white whitespace-nowrap text-xs`}
                variant="destructive"
              >
                {transaction.specialCategory}
              </Badge>
            )}
            {transaction.emotionCategory && (
              <Badge
                className={`${getColorBackGround(
                  transaction.emotionCategoryColor
                )} text-white whitespace-nowrap text-xs`}
                variant="destructive"
              >
                {transaction.emotionCategory}
              </Badge>
            )}
          </>
        )}
        {transaction.type === "income" && (
          <Badge
            className="bg-green-600 text-white whitespace-nowrap text-xs"
            variant="default"
          >
            収入
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={
            onEditClick
              ? onEditClick
              : () => router.push(`/edit/${transaction.type}/${transaction.id}`)
          }
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <DeleteTransactionModal
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          transaction={transaction}
          onSuccess={onDeleteClick ? onDeleteClick : () => router.refresh()}
        />
      </div>
    </div>
  );
}
