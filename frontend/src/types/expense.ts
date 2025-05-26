export interface Expense {
	id: number;
	userId: number;
	amount: number;
	spentAt: string;
	year: number;
	month: number;
	day: number;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	normalCategoryId: number;
	normalCategoryName: string | null;
	specialCategoryId: number;
	emotionCategoryId: number;
	emotionCategoryName: string | null;
	normalCategoryColor: string | null;
	specialCategoryColor: string | null;
	emotionCategoryColor: string | null;
}