import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Saving } from "@/types/saving";
import { LineChart } from "lucide-react";
import { motion } from "framer-motion";

interface SavingLineGraphProps {
  savings: Saving[];
}

export function SavingLineGraph({ savings }: SavingLineGraphProps) {	
	const NumberOfMonths = savings.length;
	return (
		<motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
    >
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<LineChart className="h-5 w-5" />
					貯金額推移
				</CardTitle>
				<CardDescription>過去{NumberOfMonths}ヶ月の貯金額推移</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<RechartsLineChart data={savings}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip
								formatter={(value: number) => `¥${value.toLocaleString()}`}
								labelStyle={{ color: "black" }}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
								}}
							/>
							<Line
								type="monotone"
								dataKey="amount"
								stroke="black" // 明示的な色指定
								strokeWidth={2}
								dot={{ fill: "black" }}
							/>
						</RechartsLineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
		</motion.div>
	);
}

