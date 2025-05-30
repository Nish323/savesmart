"use client";

import { CreateExpenseAndIncome } from "@/components/protected/CreateExpenseAndIncome";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreateContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "income" | "expense" | null;
  const dateParam = searchParams.get("date");
  
  const defaultType = type === "income" || type === "expense" ? type : "expense";
  const defaultDate = dateParam ? new Date(dateParam) : undefined;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div>
          <CreateExpenseAndIncome 
            defaultType={defaultType}
            defaultDate={defaultDate}
          />
        </div>
      </div>
    </main>
  );
}

export default function Create() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateContent />
    </Suspense>
  );
}
