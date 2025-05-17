import { HomeContent } from "@/components/protected/HomeContext";
import { ExpensesList } from "@/components/protected/homecontext/ExpensesList";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div>
          <HomeContent />
        </div>
        <h1 className="text-2xl font-bold mt-6 mb-6">支出一覧</h1>
        <ExpensesList />
      </div>
    </main>
  );
}
