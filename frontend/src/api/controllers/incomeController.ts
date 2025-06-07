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

export const getIncomeById = async (id: number): Promise<Income> => {
  try {
    const response = await client.get(`/incomes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching income with id ${id}:`, error);
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

export const updateIncome = async (id: number, income: any) => {
  try {
    const response = await client.put(`/incomes/${id}`, income);
    return response.data;
  } catch (error) {
    console.error(`Error updating income with id ${id}:`, error);
    throw error;
  }
};

export const deleteIncome = async (id: number) => {
  try {
    const response = await client.delete(`/incomes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting income with id ${id}:`, error);
    throw error;
  }
};
