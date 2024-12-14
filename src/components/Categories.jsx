import React, { useState, useEffect } from "react";

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch products from the API to get unique categories
    fetch("https://buyfishapi.onrender.com/api/shop/products/get")
      .then((res) => res.json())
      .then((response) => {
        if (response.success && response.data) {
          // Extract unique categories from products
          const uniqueCategories = [
            ...new Set(response.data.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          console.error("Failed to fetch products:", response.message);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleCategoryChange = (category) => {
    // Toggle category selection
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // Remove if already selected
        : [...prev, category] // Add if not selected
    );
  };

  // Notify parent component about category selection changes
  useEffect(() => {
    onCategorySelect(selectedCategories);
  }, [selectedCategories, onCategorySelect]);

  return (
    <aside className="bg-white shadow-md p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Categories</h3>
      <ul className="space-y-4">
        {categories.map((category, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`category-${index}`}
              value={category}
              onChange={() => handleCategoryChange(category)}
              checked={selectedCategories.includes(category)}
              className="cursor-pointer"
            />
            <label
              htmlFor={`category-${index}`}
              className="cursor-pointer hover:text-blue-500"
            >
              {category}
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Categories;
