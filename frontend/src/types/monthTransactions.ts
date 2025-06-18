export interface MonthIncome {
	id: number;
	year: number;
	month: number;
	incomeTotal: number;
	createdAt: string;
	updatedAt: string;
}

export interface MonthExpense {
	id: number;
	year: number;
	month: number;
	expenseTotal: number;
	createdAt: string;
	updatedAt: string;
}

export interface MonthNormalExpense {
	id: number;
	year: number;
	month: number;
	expenseTotal: number;
	normalCategoryId: number;
	normalCategoryName: string;
	normalCategoryColor: string;
	createdAt: string;
	updatedAt: string;
}

export interface MonthSpecialExpense {
	id: number;
	year: number;
	month: number;
	expenseTotal: number;
	specialCategoryId: number;
	specialCategoryName: string;
	specialCategoryColor: string;
	specialCategoryIcon: string;
	createdAt: string;
	updatedAt: string;
}

export interface MonthEmotionExpense {
	id: number;
	year: number;
	month: number;
	expenseTotal: number;
	emotionCategoryId: number;
	emotionCategoryName: string;
	emotionCategoryColor: string;
	emotionCategoryIcon: string;
	createdAt: string;
	updatedAt: string;
}

