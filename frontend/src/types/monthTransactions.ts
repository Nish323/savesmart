export interface MonthIncome {
	id: number;
	year: number;
	month: number;
	income_total: number;
	createdAt: string;
	updatedAt: string;
}

export interface MonthExpense {
	id: number;
	year: number;
	month: number;
	expense_total: number;
	createdAt: string;
	updatedAt: string;
}

export interface MonthNormalExpense {
	id: number;
	year: number;
	month: number;
	expense_total: number;
	normal_category_id: number;
	normal_category_name: string;
	normal_category_color: string;
	createdAt: string;
	updatedAt: string;
}

export interface MonthSpecialExpense {
	id: number;
	year: number;
	month: number;
	expense_total: number;
	special_category_id: number;
	special_category_name: string;
	special_category_color: string;
	special_category_icon: string;
	createdAt: string;
	updatedAt: string;
}

export interface MonthEmotionExpense {
	id: number;
	year: number;
	month: number;
	expense_total: number;
	emotion_category_id: number;
	emotion_category_name: string;
	emotion_category_color: string;
	emotion_category_icon: string;
	createdAt: string;
	updatedAt: string;
}

