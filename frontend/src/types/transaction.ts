// トランザクションの型定義
export interface Transaction {
  date: Date;
  type: "expense" | "income";
  amount: number;
  description: string;

  // 元の単一categoryフィールドを削除し、詳細なカテゴリ情報を追加
  normalCategory?: string | null;
  specialCategory?: string | null;
  emotionCategory?: string | null;

  // 色情報は色名(例: "gray", "blue"など)なので文字列型で定義
  normalCategoryColor?: string | null;
  specialCategoryColor?: string | null;
  emotionCategoryColor?: string | null;

  // 収入用にシンプルなカテゴリフィールド維持
  category?: string;
}

// 支出データの型定義
export interface Expense {
  id: number;
  userId: number;
  amount: number;
  memo: string | null;
  spentAt: string;
  year: number;
  month: number;
  day: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  normalCategoryId: number;
  normalCategoryName: string | null;
  specialCategoryId: number;
  specialCategoryName: string | null;
  emotionCategoryId: number;
  emotionCategoryName: string | null;

  // カラー情報を追加（色名として文字列型）
  normalCategoryColor?: string | null;
  specialCategoryColor?: string | null;
  emotionCategoryColor?: string | null;
}

export interface Income {
  id: number;
  userId: number;
  income: number;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}
