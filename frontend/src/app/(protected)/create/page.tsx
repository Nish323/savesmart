import { CreateExpenseAndIncome } from "@/components/protected/CreateExpenseAndIncome";

export default function Create() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div>
          <CreateExpenseAndIncome />
        </div>
      </div>
    </main>
  );
}
