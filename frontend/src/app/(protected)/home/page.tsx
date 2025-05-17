import { HomeContent } from "@/components/protected/HomeContext";
import { ExpensesList } from "@/components/protected/ExpensesList";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-6">支出一覧</h1>
        <ExpensesList />
        <div className="mt-8">
          <HomeContent />
        </div>
      </div>
    </main>
  );
}
