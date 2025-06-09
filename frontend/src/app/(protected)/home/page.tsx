import { HomeContext } from "@/components/protected/HomeContext";
import { ExpensesList } from "@/components/protected/homeContext/ExpensesList";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div>
          <HomeContext />
          <ExpensesList />
        </div>
      </div>
    </main>
  );
}
