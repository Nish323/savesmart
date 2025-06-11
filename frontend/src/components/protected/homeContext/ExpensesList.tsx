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
  getEmotionCategories,
} from "@/api/controllers/categoryController";

export function ExpensesList() {
  const [expenses, setExpenses] = useState<ExpenseAndIncomeTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "expense" | "income" | null
  >(null);
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
          emotion: emotionCategoriesData,
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 支出データを取得する関数
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

  // 初回レンダリング時とモーダルが閉じられたときにデータを取得
  useEffect(() => {
    fetchExpenses();
  }, [isEditExpenseModalOpen, isEditIncomeModalOpen]); // モーダルが閉じられたときにデータを再取得

  // 修正ボタンがクリックされたときの処理（非推奨：HomeListで直接処理するように変更）
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
  const handleUpdateSuccess = async (message: string) => {
    setSuccessMessage(message);
    // 3秒後にメッセージをクリア
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
    
    // データを再取得
    await fetchExpenses();
    
    // カスタムイベントを発行して他のコンポーネントに通知
    window.dispatchEvent(new CustomEvent('transaction-updated'));
  };

  // 他のコンポーネントからのトランザクション更新イベントをリッスン
  useEffect(() => {
    const handleTransactionUpdatedEvent = () => {
      console.log("Transaction updated event received in ExpensesList, refreshing data...");
      fetchExpenses();
    };
    
    window.addEventListener('transaction-updated', handleTransactionUpdatedEvent);
    
    return () => {
      window.removeEventListener('transaction-updated', handleTransactionUpdatedEvent);
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mt-6 mb-6">支出一覧</h1>
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
                  onUpdateSuccess={handleUpdateSuccess}
                  onDeleteClick={() => handleUpdateSuccess("支出が削除されました")}
                  normalCategories={normalCategories}
                  specialCategories={specialCategories}
                  emotionCategories={emotionCategories}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              支出はありません
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
