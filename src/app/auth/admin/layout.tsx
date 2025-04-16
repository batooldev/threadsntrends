"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from "@/components/admin/sidebar"; // Adjust the import path as needed
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/auth");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-rosy_pink w-full flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-white mb-6 mt-6">
        {children}
      </main>
    </div>
  );
}
