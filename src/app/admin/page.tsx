"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">Statistic 1</div>
        <div className="p-6 bg-white rounded-lg shadow">Statistic 2</div>
        <div className="p-6 bg-white rounded-lg shadow">Statistic 3</div>
      </div>
      {/* You can add more sections, charts, tables, etc. as needed */}
    </div>
  );
}
