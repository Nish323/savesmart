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

export const getExpenseById = async (id: number) => {
  try {
    const response = await client.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching expense with id ${id}:`, error);
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

export const updateExpense = async (id: number, expense: any) => {
  try {
    const response = await client.put(`/expenses/${id}`, expense);
    return response.data;
  } catch (error) {
    console.error(`Error updating expense with id ${id}:`, error);
    throw error;
  }
};

export const deleteExpense = async (id: number) => {
  try {
    const response = await client.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting expense with id ${id}:`, error);
    throw error;
  }
};
