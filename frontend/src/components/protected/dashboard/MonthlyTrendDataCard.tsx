import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Legend,
  ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import { MonthlyTrendData } from "@/types/dashboard/monthlyTrendData"; // Assuming you have this

interface MonthlyTrendDataCardProps {
  monthlyTrendData: MonthlyTrendData[];
}


export const MonthlyTrendDataCard = ({
  monthlyTrendData
}: MonthlyTrendDataCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            支出習慣の時系列変化
          </CardTitle>
          <CardDescription>月別の支出パターン分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrendData}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `¥${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar dataKey="総支出" barSize={20} fill="#ccc" />
                <Line
                  type="monotone"
                  dataKey="無駄遣い"
                  stroke="hsl(346.8 77.2% 49.8%)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="自己投資"
                  stroke="hsl(142.1 76.2% 36.3%)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
