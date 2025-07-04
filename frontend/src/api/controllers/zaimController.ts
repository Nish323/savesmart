import client from "@/utils/axios/client";

export interface ZaimExpense {
  id: string;
  amount: number;
  date: string;
  category_id?: number;
  genre_id?: number;
  comment: string;
  place: string;
  name: string;
}

export interface ZaimExpensesResponse {
  expenses: ZaimExpense[];
}

/**
 * 指定した日付のZaim支出データを取得
 */
export const getZaimExpenses = async (date: string): Promise<ZaimExpensesResponse> => {
  try {
    const response = await client.get(`/zaim/expenses?date=${date}`);
    return response.data;
  } catch (error: any) {
    console.error('Zaim支出データの取得に失敗しました:', error);
    throw new Error(error.response?.data?.error || 'Zaim支出データの取得に失敗しました');
  }
};
