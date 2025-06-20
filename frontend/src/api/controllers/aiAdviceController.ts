'use client';
import client from '@/utils/axios/client';

export const analyzeExpenses = async () => {
	try {
		const response = await client.post('/ai-advice/analyze');
		return response.data;
	} catch (error) {
		console.error('Error analyzing expenses:', error);
		throw error;
	}
}
