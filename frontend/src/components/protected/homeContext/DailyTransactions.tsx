"use client";

import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { HomeList } from "./sharedComponent/HomeList";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";
import { EditExpenseModal } from "./EditExpenseModal";
import { EditIncomeModal } from "./EditIncomeModal";
import { 
  getNormalCategories, 
  getSpecialCategories, 
  getEmotionCategories 
} from "@/api/controllers/categoryController";

interface DailyTransactionsProps {
  selectedDate: Date;
  transactions: ExpenseAndIncomeTransaction[];
  normalCategories?: any[];
  specialCategories?: any[];
  emotionCategories?: any[];
  onTransactionUpdated?: () => void;
  onDateChanged?: (newDate: Date) => void;
}

export function DailyTransactions({
  selectedDate,
  transactions,
  normalCategories = [],
  specialCategories = [],
  emotionCategories = [],
  onTransactionUpdated,
  onDateChanged,
}: DailyTransactionsProps) {
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<"expense" | "income" | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<ExpenseAndIncomeTransaction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localNormalCategories, setLocalNormalCategories] = useState<any[]>([]);
  const [localSpecialCategories, setLocalSpecialCategories] = useState<any[]>([]);
  const [localEmotionCategories, setLocalEmotionCategories] = useState<any[]>([]);

  // 親コンポーネントからカテゴリーが渡された場合の処理
  useEffect(() => {
    if (normalCategories.length > 0) {
      setLocalNormalCategories(normalCategories);
    }
    if (specialCategories.length > 0) {
      setLocalSpecialCategories(specialCategories);
    }
    if (emotionCategories.length > 0) {
      setLocalEmotionCategories(emotionCategories);
    }
  }, [normalCategories, specialCategories, emotionCategories]);

  // APIからカテゴリーデータを取得（初回のみ）
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 親コンポーネントからカテゴリーが渡されていない場合のみAPIから取得
        if (normalCategories.length === 0) {
          const normalCategoriesData = await getNormalCategories();
          setLocalNormalCategories(normalCategoriesData);
        }

        if (specialCategories.length === 0) {
          const specialCategoriesData = await getSpecialCategories();
          setLocalSpecialCategories(specialCategoriesData);
        }

        if (emotionCategories.length === 0) {
          const emotionCategoriesData = await getEmotionCategories();
          setLocalEmotionCategories(emotionCategoriesData);
        }
        
        console.log("DailyTransactions - Categories loaded from API");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 修正ボタンがクリックされたときの処理
  const handleEditClick = (transaction: ExpenseAndIncomeTransaction) => {
    setSelectedTransactionId(transaction.id);
    setSelectedTransactionType(transaction.type);
    setSelectedTransaction(transaction);
    
    if (transaction.type === "expense") {
      setIsEditExpenseModalOpen(true);
    } else if (transaction.type === "income") {
      setIsEditIncomeModalOpen(true);
    }
  };

  // 更新成功時の処理
  const handleUpdateSuccess = (message: string) => {
    setSuccessMessage(message);
    // 3秒後にメッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
    
    // 日付が変更されたかどうかを確認
    const dateChanged = message.includes("日付が変更されました");
    
    // 親コンポーネントに更新を通知
    if (onTransactionUpdated) {
      onTransactionUpdated();
    }
    
    // 日付が変更された場合は、メッセージを追加してカレンダーを更新
    if (dateChanged) {
      // 既存のメッセージに追加情報を付加
      setSuccessMessage(prev => 
        `${prev || message} (カレンダーを確認してください)`
      );
      
      // 親コンポーネントに日付変更を通知（もし日付が変更されたトランザクションがあれば）
      if (onDateChanged && selectedTransaction) {
        onDateChanged(selectedTransaction.date);
      }
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, "yyyy年 MM月 dd日")}の収支
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <HomeList
                  key={`${transaction.type}-${transaction.id}`}
                  transaction={transaction}
                  showDate={false}
                  onUpdateSuccess={handleUpdateSuccess}
                  onDeleteClick={() => handleUpdateSuccess("削除されました")}
                  normalCategories={localNormalCategories}
                  specialCategories={localSpecialCategories}
                  emotionCategories={localEmotionCategories}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              この日の記録はありません
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
