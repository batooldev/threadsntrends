"use client";

import AdminSidebar from "@/components/admin/sidebar"; // Adjust the import path as needed
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-rosy_pink flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-white mb-6 mt-6">
        {children}
      </main>
    </div>
  );
}
