import React, { useEffect, useState } from "react";
import "./CategoryDropdown.css";

const CategoryDropdown = ({ onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [subSubCategories, setSubSubCategories] = useState({});

  const [selectedText, setSelectedText] = useState("Select Category");

  useEffect(() => {
    fetch("http://localhost:5003/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        data.forEach((cat) => {
          fetch(`http://localhost:5003/api/subcategories/byCategory/${cat.category}`)
            .then((res) => res.json())
            .then((sub) => {
              setSubCategories(prev => ({ ...prev, [cat.category]: sub }));
              sub.forEach((s) => {
                fetch(`http://localhost:5003/api/subsubcategories/byCatSubCat?category=${cat.category}&subCategory=${s.subCategory}`)
                  .then((res) => res.json())
                  .then((subsub) => {
                    setSubSubCategories(prev => ({ ...prev, [s.subCategory]: subsub }));
                  });
              });
            });
        });
      });
  }, []);

  const handleSubSubCategoryClick = (cat, sub, subsub) => {
    setSelectedText(`${subsub}`);
    setIsDropdownOpen(false);
    onSelect?.({
      category: cat,
      subCategory: sub,
      subSubCategory: subsub,
    });
  };

  return (
    <div className="multi-dropdown-wrapper">
      <div className="multi-dropdown-selector" onClick={() => setIsDropdownOpen(prev => !prev)}>
        {selectedText}
      </div>

      {isDropdownOpen && (
        <ul className="multi-dropdown-menu">
          {categories.map((cat) => (
            <li className="dropdown-item" key={cat._id}>
              {cat.category}
              {subCategories[cat.category]?.length > 0 && (
                <ul className="sub-menu">
                  {subCategories[cat.category].map((sub) => (
                    <li className="dropdown-item" key={sub._id}>
                      {sub.subCategory}
                      {subSubCategories[sub.subCategory]?.length > 0 && (
                        <ul className="sub-menu right-sub-menu">
                          {subSubCategories[sub.subCategory].map((subsub) => (
                            <li
                              className="dropdown-item"
                              key={subsub._id}
                              onClick={() => handleSubSubCategoryClick(cat.category, sub.subCategory, subsub.subSubCategory)}
                            >
                              {subsub.subSubCategory}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
