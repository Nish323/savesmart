export interface ExpenseAndIncomeTransaction {
  id: number;
  date: Date;
  type: "expense" | "income";
  amount: number;
  description: string;
  normalCategory: string | null;
  specialCategory: string | null;
  emotionCategory: string | null;
  normalCategoryColor: string | null;
  specialCategoryColor: string | null;
  emotionCategoryColor: string | null;
  category?: string;
}
