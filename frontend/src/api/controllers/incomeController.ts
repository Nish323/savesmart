"use client";
import client from "@/utils/axios/client";
import { Income } from "@/types/income";

export const getIncomes = async (): Promise<Income[]> => {
  try {
    const response = await client.get("/incomes");
    return response.data;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }
};

export const createIncome = async (income: any) => {
  try {
    console.log(income);
    const response = await client.post("/incomes", income);
    return response.data;
  } catch (error) {
    console.error("Error creating income:", error);
    throw error;
  }
};
