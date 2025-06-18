'use client';
import client from '@/utils/axios/client';

export const getDashboardData = async () => {
	try {
		const response = await client.get('/dashboard');
		return response.data;
	} catch (error) {
		console.error('Error fetching Saving:', error);
	}
}