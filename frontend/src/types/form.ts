export interface ExpenseFormData {
  date: Date;
  amount: string;
  normalCategoryId: string;
  specialCategoryId?: string;
  emotionCategoryId?: string;
  memo?: string;
}

export interface ExpenseFormProps {
  normalCategories: Category[];
  specialCategories: SpecialCategory[];
  emotionCategories: EmotionCategory[];
  onSuccess: (message: string) => void;
  defaultDate?: Date;
}

export interface IncomeFormData {
  date: Date;
  income: string;
  memo: string;
}
