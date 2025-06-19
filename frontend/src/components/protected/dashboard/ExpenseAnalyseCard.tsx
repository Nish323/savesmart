import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart as PieChartIcon } from "lucide-react";

interface ExpenseAnalyseCardProps {
  categoryExpenseData: { name: string; value: number; color: string }[];
  specialExpenseData: { name: string; value: number; color: string }[];
  emotionExpenseData: { name: string; value: number; color: string }[];
}

export const ExpenseAnalyseCard = ({
  categoryExpenseData,
  specialExpenseData,
  emotionExpenseData,
}: ExpenseAnalyseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            支出分析
          </CardTitle>
          <CardDescription>今月の支出内訳</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="category" className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="category">通常</TabsTrigger>
              <TabsTrigger value="weight">自己管理</TabsTrigger>
              <TabsTrigger value="emotion">感情</TabsTrigger>
            </TabsList>
            <TabsContent value="category">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryExpenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `¥${value.toLocaleString()}`
                      }
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="weight">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={specialExpenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {specialExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `¥${value.toLocaleString()}`
                      }
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="emotion">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={emotionExpenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {emotionExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `¥${value.toLocaleString()}`
                      }
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
