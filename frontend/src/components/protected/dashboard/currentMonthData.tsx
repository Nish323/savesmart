import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { CurrentMonthData } from "@/types/currentMonthData";

interface CurrentMonthDataProps {
  currentSaving: CurrentMonthData;
  currentMonthIncome: CurrentMonthData;
  currentMonthExpense: CurrentMonthData;
}

export const CurrentMonthDataCards = ({
  currentSaving,
  currentMonthIncome,
  currentMonthExpense,
}: CurrentMonthDataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
      {[
        {
          title: "貯金額",
          value: `¥${currentSaving.latestAmount}`,
          icon: Wallet,
          trend: currentSaving.rate?.toFixed(1) + "%",
          trendUp: currentSaving.trendUp,
        },
        {
          title: "今月の収入",
          value: `¥${currentMonthIncome.latestAmount}`,
          icon: currentMonthIncome.trendUp ? ArrowUp : ArrowDown,
          trend: currentMonthIncome.rate.toFixed(1) + "%",
          trendUp: currentMonthIncome.trendUp,
        },
        {
          title: "今月の支出",
          value: `¥${currentMonthExpense.latestAmount}`,
          icon: currentMonthExpense.trendUp ? ArrowDown : ArrowUp,
          trend: currentMonthExpense.rate.toFixed(1) + "%",
          trendUp: !currentMonthExpense.trendUp,
        },
      ].map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      stat.trendUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trendUp ? "+" + stat.trend : "-" + stat.trend}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
