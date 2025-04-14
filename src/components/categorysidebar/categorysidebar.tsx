"use client";

import { useState } from 'react';
import { ChevronRight, Menu, ChevronDown } from 'lucide-react';

interface SubCategory {
  name: string;
  categories: string[];
}

interface Collection {
  name: string;
  subCategories: SubCategory[];
}

interface MainCategory {
  name: string;
  collections: Collection[];
}

interface CategorySidebarProps {
  onCategorySelect: (category: string) => void;
}

const categories: MainCategory[] = [
  {
    name: "WOMEN",
    collections: [
      {
        name: "Summer Collection",
        subCategories: [
          {
            name: "Lawn",
            categories: ["Luxury Lawn", "Premium Lawn", "Basic Lawn"]
          },
          {
            name: "Cotton",
            categories: ["Printed Cotton", "Plain Cotton"]
          },
          {
            name: "Shiffon",
            categories: ["Embroidered Shiffon", "Plain Shiffon"]
          }
        ]
      },
      {
        name: "Winter Collection",
        subCategories: [
          {
            name: "Kadar",
            categories: ["Premium Kadar", "Basic Kadar"]
          }
        ]
      }
    ]
  },
  {
    name: "MEN",
    collections: [
      {
        name: "Summer Collection",
        subCategories: [
          {
            name: "Cotton",
            categories: ["Premium Cotton", "Basic Cotton"]
          }
        ]
      },
      {
        name: "Winter Collection",
        subCategories: [
          {
            name: "Kadar",
            categories: ["Premium Kadar", "Basic Kadar"]
          }
        ]
      }
    ]
  }
];

const CategorySidebar = ({ onCategorySelect }: CategorySidebarProps) => {
  const [expandedMain, setExpandedMain] = useState<string>('');
  const [expandedCollection, setExpandedCollection] = useState<string>('');
  const [expandedSubCategory, setExpandedSubCategory] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleMain = (name: string) => {
    setExpandedMain(expandedMain === name ? '' : name);
  };

  const toggleCollection = (name: string) => {
    setExpandedCollection(expandedCollection === name ? '' : name);
  };

  const toggleSubCategory = (name: string) => {
    setExpandedSubCategory(expandedSubCategory === name ? '' : name);
  };

  return (
    <div className="mt-6 mb-6">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="bg-[#B39F93] text-white p-3 w-[100%] rounded-t-lg flex items-center gap-2"
      >
        <Menu className="h-5 w-5" />
        <span className="text-lg font-semibold">Category</span>
      </button>

      {isSidebarOpen && (
        <div className="w-64 bg-white shadow-lg rounded-b-lg overflow-hidden">
          <div className="divide-y divide-[#E5D9D3]">
            {categories.map((main) => (
              <div key={main.name}>
                <div
                  className="flex items-center justify-between p-3 hover:bg-[#F5EFE9] cursor-pointer transition-colors"
                  onClick={() => toggleMain(main.name)}
                >
                  <span className="text-gray-700">{main.name}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    expandedMain === main.name ? 'rotate-180' : ''
                  }`} />
                </div>
                
                {expandedMain === main.name && (
                  <div className="pl-4">
                    {main.collections.map(collection => (
                      <div key={collection.name}>
                        <div
                          className="flex items-center justify-between p-2 hover:bg-[#F5EFE9] cursor-pointer"
                          onClick={() => toggleCollection(collection.name)}
                        >
                          <span className="text-gray-600">{collection.name}</span>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedCollection === collection.name ? 'rotate-180' : ''
                          }`} />
                        </div>

                        {expandedCollection === collection.name && (
                          <div className="pl-4">
                            {collection.subCategories.map(subCategory => (
                              <div key={subCategory.name}>
                                <div
                                  className="flex items-center justify-between p-2 hover:bg-[#F5EFE9] cursor-pointer"
                                  onClick={() => toggleSubCategory(subCategory.name)}
                                >
                                  <span className="text-gray-600">{subCategory.name}</span>
                                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                                    expandedSubCategory === subCategory.name ? 'rotate-180' : ''
                                  }`} />
                                </div>

                                {expandedSubCategory === subCategory.name && (
                                  <div className="pl-4">
                                    {subCategory.categories.map(category => (
                                      <div
                                        key={category}
                                        className="p-2 text-gray-600 hover:text-[#8C7B6F] cursor-pointer"
                                        onClick={() => onCategorySelect(category)}
                                      >
                                        {category}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
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