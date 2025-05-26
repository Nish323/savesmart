"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp } from "lucide-react";
import client from "@/utils/axios/client";
import { Category, SpecialCategory, EmotionCategory } from "@/types/form";
import { SuccessMessage } from "./createcontext/SuccessMessage";
import { ExpenseForm } from "./createcontext/ExpenseForm";
import { IncomeForm } from "./createcontext/IncomeForm";

type CreateExpenseFormProps = {
  defaultType?: "expense" | "income";
  defaultDate?: Date;
};

export function CreateExpenseAndIncome({
  defaultType = "expense",
  defaultDate,
}: CreateExpenseFormProps) {
  const [type, setType] = useState<"expense" | "income">(defaultType);
  const [normalCategories, setNormalCategories] = useState<Category[]>([]);
  const [specialCategories, setSpecialCategories] = useState<SpecialCategory[]>([]);
  const [emotionCategories, setEmotionCategories] = useState<EmotionCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [normalRes, specialRes, emotionRes] = await Promise.all([
          client.get('/normal-categories'),
          client.get('/special-categories'),
          client.get('/emotion-categories'),
        ]);
        
        setNormalCategories(normalRes.data);
        setSpecialCategories(specialRes.data);
        setEmotionCategories(emotionRes.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">収支を記録</h1>
            <p className="text-gray-600">
              収入・支出の内容を入力して記録できます
            </p>
          </div>

          {successMessage && (
            <SuccessMessage message={successMessage} />
          )}

          <Tabs
            value={type}
            onValueChange={(value) => setType(value as "expense" | "income")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="expense" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                支出を記録
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                収入を記録
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expense">
              <ExpenseForm
                normalCategories={normalCategories}
                specialCategories={specialCategories}
                emotionCategories={emotionCategories}
                onSuccess={handleSuccess}
                defaultDate={defaultDate}
              />
            </TabsContent>

            <TabsContent value="income">
              <IncomeForm
                onSuccess={handleSuccess}
                defaultDate={defaultDate}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
