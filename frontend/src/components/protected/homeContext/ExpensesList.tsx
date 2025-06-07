"use client";

import { useState, useEffect } from "react";
import { getExpenses } from "@/api/controllers/expenseController";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Expense } from "@/types/transaction";
import { HomeList } from "./sharedComponent/HomeList";
import { ExpenseAndIncomeTransaction } from "@/types/expenseandincome/ExpenseAndIncomeTransaction";
import { parseISO } from "date-fns/parseISO";
import { EditExpenseModal } from "./EditExpenseModal";
import { EditIncomeModal } from "./EditIncomeModal";
import { 
  getNormalCategories, 
  getSpecialCategories, 
  getEmotionCategories 
} from "@/api/controllers/categoryController";

export function ExpensesList() {
  const [expenses, setExpenses] = useState<ExpenseAndIncomeTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<"expense" | "income" | null>(null);
  const [normalCategories, setNormalCategories] = useState<any[]>([]);
  const [specialCategories, setSpecialCategories] = useState<any[]>([]);
  const [emotionCategories, setEmotionCategories] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // カテゴリーデータを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // APIからカテゴリーを取得
        const normalCategoriesData = await getNormalCategories();
        const specialCategoriesData = await getSpecialCategories();
        const emotionCategoriesData = await getEmotionCategories();
        
        setNormalCategories(normalCategoriesData);
        setSpecialCategories(specialCategoriesData);
        setEmotionCategories(emotionCategoriesData);
        
        console.log("Categories loaded:", {
          normal: normalCategoriesData,
          special: specialCategoriesData,
          emotion: emotionCategoriesData
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        // Expense型からExpenseAndIncomeTransaction型に変換
        const convertedExpenses = data.map((expense: Expense) => ({
          id: expense.id,
          date: expense.spentAt ? parseISO(expense.spentAt) : new Date(),
          type: "expense" as const,
          amount: expense.amount,
          normalCategory: expense.normalCategoryName || "",
          specialCategory: expense.specialCategoryName || "",
          emotionCategory: expense.emotionCategoryName || "",
          normalCategoryColor: expense.normalCategoryColor || "",
          specialCategoryColor: expense.specialCategoryColor || "",
          emotionCategoryColor: expense.emotionCategoryColor || "",
          description: expense.memo || "詳細なし",
        }));
        // 日付で降順ソートして最新の5件を取得
        const sortedExpenses = convertedExpenses.sort(
          (a: ExpenseAndIncomeTransaction, b: ExpenseAndIncomeTransaction) =>
            b.date.getTime() - a.date.getTime()
        );
        const latestExpenses = sortedExpenses.slice(0, 5);
        setExpenses(latestExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [isEditExpenseModalOpen, isEditIncomeModalOpen]); // モーダルが閉じられたときにデータを再取得

  // 修正ボタンがクリックされたときの処理
  const handleEditClick = (transaction: ExpenseAndIncomeTransaction) => {
    setSelectedTransactionId(transaction.id);
    setSelectedTransactionType(transaction.type);
    
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
  };

  return (
    <>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>最近の支出</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <HomeList
                  key={expense.id}
                  transaction={expense}
                  showDate={true}
                  onEditClick={() => handleEditClick(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">支出はありません</div>
          )}
        </CardContent>
      </Card>

      {/* 支出編集モーダル */}
      {selectedTransactionType === "expense" && (
        <EditExpenseModal
          isOpen={isEditExpenseModalOpen}
          onClose={() => setIsEditExpenseModalOpen(false)}
          expenseId={selectedTransactionId}
          onSuccess={handleUpdateSuccess}
          normalCategories={normalCategories}
          specialCategories={specialCategories}
          emotionCategories={emotionCategories}
          initialData={expenses.find(e => e.id === selectedTransactionId)}
        />
      )}

      {/* 収入編集モーダル */}
      {selectedTransactionType === "income" && (
        <EditIncomeModal
          isOpen={isEditIncomeModalOpen}
          onClose={() => setIsEditIncomeModalOpen(false)}
          incomeId={selectedTransactionId}
          onSuccess={handleUpdateSuccess}
          initialData={expenses.find(e => e.id === selectedTransactionId)}
        />
      )}
    </>
  );
}
