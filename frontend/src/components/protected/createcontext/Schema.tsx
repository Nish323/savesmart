import * as z from "zod";

export const expenseItemSchema = z.object({
	amount: z.string().min(1, { message: "金額を入力してください" }),
	normalCategoryId: z
		.string()
		.min(1, { message: "通常カテゴリーを選択してください" }),
	specialCategoryId: z
		.string()
		.min(1, { message: "特別カテゴリーを選択してください" }),
	emotionCategoryId: z
		.string()
		.min(1, { message: "感情カテゴリーを選択してください" }),
	weight: z.string().min(1, { message: "重み付けを選択してください" }),
	emotion: z.string().min(1, { message: "感情を選択してください" }),
	memo: z.string().optional(),
});

export const formSchema = z.object({
	date: z.date({
		required_error: "日付を選択してください",
	}),
	items: z
		.array(expenseItemSchema)
		.min(1, { message: "最低1つの項目を入力してください" }),
	memo: z.string().optional(),
});