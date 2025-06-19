import { MonthExpense } from "@/types/monthTransactions";


interface getMonthlyTrendAmountProps {
	Datas: MonthExpense[];
	currentMonth: string;
	currentYear: string;
}

export const getMonthlyTrendAmount = ( 
	{ Datas, currentMonth, currentYear }: getMonthlyTrendAmountProps
) => {
	const currentMonthData = Datas.find(
		(data) => data.month === `${currentYear}-${currentMonth}`
	);

	if (!currentMonthData) {
		return {
			totalExpense: 0,
			totalIncome: 0,
			totalSelfInvestment: 0,
		};
	}

	const totalExpense = currentMonthData.ExpenseTotal || 0;
	const totalIncome = currentMonthData.WasteTotal || 0;
	const totalSelfInvestment = currentMonthData.SelfInvestmentTotal || 0;

	return {
		totalExpense,
		totalIncome,
		totalSelfInvestment,
	};
} 