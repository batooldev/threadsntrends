"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#D6C4B2] text-gray-800 p-6 mt-6 mb-6">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/admin">
              <div className="">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/products">
              <div className="">Products</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders">
              <div className="">Orders</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <div className="">Users</div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
