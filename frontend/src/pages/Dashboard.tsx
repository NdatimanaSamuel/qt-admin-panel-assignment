// src/pages/Dashboard.tsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChartCard from "../components/ChartCard";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
