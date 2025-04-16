"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Pencil, Save, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  stock: number;
  reorderLevel: number;
  price: number;
  category: string;
}

export default function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const { success, data } = await res.json();
      if (success) {
        setProducts(data);
      } else {
        throw new Error("Failed to fetch inventory");
      }
    } catch (err) {
      console.error("Failed to load inventory", err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productId: string) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          stock: editForm.stock,
          reorderLevel: editForm.reorderLevel
        }),
      });

      if (!response.ok) throw new Error('Failed to update inventory');
      
      await fetchInventory();
      setEditingId(null);
    } catch (err) {
      setError('Failed to update inventory');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">📦 Inventory Management</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3">Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLowStock = product.stock < 10; // Changed condition here
                
                return (
                  <tr 
                    key={product._id} 
                    className={`border-t hover:bg-gray-50 ${
                      isLowStock ? 'bg-red-100' : ''  // Made red background more visible
                    }`}
                  >
                    <td className="p-3">{product.name}</td>
                    <td>{product.category}</td>
                    <td className={`${isLowStock ? 'text-red-600 font-semibold' : ''}`}>
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editForm.stock || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            stock: parseInt(e.target.value)
                          })}
                          className="w-20 border rounded p-1"
                        />
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td>
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={editForm.reorderLevel || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            reorderLevel: parseInt(e.target.value)
                          })}
                          className="w-20 border rounded p-1"
                        />
                      ) : (
                        product.reorderLevel
                      )}
                    </td>
                    <td>Rs. {product.price}</td>
                    <td className="text-center">
                      {isLowStock && (
                        <div className="flex items-center justify-center text-red-600 text-xs mb-1">
                          <AlertTriangle size={14} className="mr-1" />
                          Low Stock
                        </div>
                      )}
                      {editingId === product._id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleSave(product._id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(product._id);
                            setEditForm(product);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
