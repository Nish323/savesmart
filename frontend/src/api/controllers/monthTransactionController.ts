'use client';
import client from '@/utils/axios/client';

// 月ごとの収入の取得
export const getMonthIncomes = async () => {
  try {
    const response = await client.get('/month-incomes');
    return response.data;
  } catch (error) {
    console.error('Error fetching MonthIncome:', error);
  }
};

// 月ごとの支出の取得
export const getMonthExpenses = async () => {
	try {
		const response = await client.get('/month-expenses');
		return response.data;
	} catch (error) {
		console.error('Error fetching MonthExpense:', error);
	}
}

// 月ごとのNormalCategoryExpenseの取得
export const getMonthNormalCategoryExpenses = async () => {
	try {
		const response = await client.get('/month-normal-category-expenses');
		return response.data;
	} catch (error) {
		console.error('Error fetching MonthNormalCategoryExpense:', error);
	}
}

// 月ごとのSpecialCategoryExpenseの取得
export const getMonthSpecialCategoryExpenses = async () => {
	try {
		const response = await client.get('/month-special-category-expenses');
		return response.data;
	} catch (error) {
		console.error('Error fetching MonthSpecialCategoryExpense:', error);
	}
}

// 月ごとのEmotionCategoryExpenseの取得
export const getMonthEmotionCategoryExpenses = async () => {
	try {
		const response = await client.get('/month-emotion-category-expenses');
		return response.data;
	} catch (error) {
		console.error('Error fetching MonthEmotionCategoryExpense:', error);
	}
}
