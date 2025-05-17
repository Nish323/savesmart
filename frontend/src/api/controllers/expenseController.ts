'use client';
import client from '@/utils/axios/client';

export const getExpenses = async () => {
  try {
    const response = await client.get('/expenses');
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};
