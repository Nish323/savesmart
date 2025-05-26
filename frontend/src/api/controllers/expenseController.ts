'use client';
import client from '@/utils/axios/client';
import { Expense } from '@/types/expense';

export const getExpenses = async () => {
  try {
    const response = await client.get('/expenses');
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const createExpense = async (expense: any) => {
  try {
    const response = await client.post('/expenses', expense);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};
