export const getCurrentMonthData = (data: any) => {
	const length : number = Object.keys(data).length;
  const latestAmount = data[length - 1]?.amount || data[length - 1]?.incomeTotal || data[length - 1]?.expenseTotal || 0;
	const previousAmount = data[length - 2]?.amount || data[length - 2]?.incomeTotal || data[length - 2]?.expenseTotal || 0;
  const trendUp = latestAmount > previousAmount;
  let rate: number = 0;
  if(trendUp){
    rate = latestAmount / previousAmount || 0;
  } else {
    rate = previousAmount / latestAmount || 0;
  }

	return {
		latestAmount,
		trendUp,
		rate,
	}
}