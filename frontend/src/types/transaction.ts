// トランザクションの型定義
export interface Transaction {
  date: Date;
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
}

// 支出データの型定義
export interface Expense {
  id: number;
  userId: number;
  normalCategoryId: number;
  specialCategoryId: number;
  emotionCategoryId: number;
  amount: number;
  memo: string | null;
  spentAt: string;
  year: number;
  month: number;
  day: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
