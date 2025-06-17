'use client';
import client from '@/utils/axios/client';

export const getSaving = async () => {
	try {
		const response = await client.get('/savings');
		return response.data;
	} catch (error) {
		console.error('Error fetching Saving:', error);
	}
}