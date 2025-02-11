"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-solid_brown text-gray-800 p-6 mt-6 mb-6">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/admin">
              <div className="hover:text-gray-300">Dashboard</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/products">
              <div className="hover:text-gray-300">Products</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders">
              <div className="hover:text-gray-300">Orders</div>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <div className="hover:text-gray-300">Users</div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
