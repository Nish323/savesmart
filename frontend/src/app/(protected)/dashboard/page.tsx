import { DashboardContent } from "@/components/protected/DashboardContent";

export default function Dashboard() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div>
          <DashboardContent />
        </div>
      </div>
    </main>
  );
}
