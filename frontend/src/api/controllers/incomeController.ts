"use client";
import client from "@/utils/axios/client";
import { Income } from "@/types/transaction"; // Income型をインポート

export const getIncomes = async (): Promise<Income[]> => {
  // 返り値の型を Promise<Income[]> に指定
  try {
    const response = await client.get("/incomes");
    return response.data;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }
};
