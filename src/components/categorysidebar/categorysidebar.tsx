"use client";

import { useState } from 'react';
import { ChevronRight, Menu, ChevronDown } from 'lucide-react';

interface Category {
  name: string;
  sub: string[];
}

interface CategorySidebarProps {
  onCategorySelect: (gender: string, collection?: string) => void;
}

const categories: Category[] = [
  { name: "WOMEN", sub: ["Luxury Lawn", "Kadar", "Loan"] },
  { name: "MEN", sub: ["Winter Collection", "Summer Collection"] }
];

const CategorySidebar = ({ onCategorySelect }: CategorySidebarProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleCategory = (name: string): void => {
    setExpandedCategory(expandedCategory === name ? '' : name);
    onCategorySelect(name);
  };

  const handleCollectionSelect = (collection: string): void => {
    onCategorySelect(collection);
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="mt-6 mb-6">
      <button
        onClick={toggleSidebar}
        className="bg-[#B39F93] text-white p-3 w-[100%] rounded-t-lg flex items-center gap-2"
      >
        <Menu className="h-5 w-5" />
        <span className="text-lg font-semibold">Category</span>
      </button>

      {isSidebarOpen && (
        <div className="w-64 bg-white shadow-lg rounded-b-lg overflow-hidden">
          <div className="divide-y divide-[#E5D9D3]">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div
                  className="flex items-center justify-between p-3 hover:bg-[#F5EFE9] cursor-pointer transition-colors"
                  // onClick={() => toggleCategory(cat.name)}
                >
                  <span className="text-gray-700">{cat.name}</span>
                  {cat.sub.length > 0 ? (
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        expandedCategory === cat.name ? 'rotate-180' : ''
                      }`}
                    />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                {expandedCategory === cat.name && cat.sub.length > 0 && (
                  <div className="bg-[#FAF7F5] px-4 py-2">
                    {cat.sub.map((sub) => (
                      <div
                        key={sub}
                        className="py-2 text-gray-600 hover:text-[#8C7B6F] cursor-pointer transition-colors"
                        onClick={() => handleCollectionSelect(sub)}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;