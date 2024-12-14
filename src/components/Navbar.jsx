import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom"; // For navigation links
import CartSidebar from "./CartSidebar"; // CartSidebar component
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";


const Navbar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false); // State for toggling cart sidebar
  const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
  const cartSidebarRef = useRef(null); // Ref for the cart sidebar container
  //const userId = "67569cb4830a409fb85ce166"; // Replace with dynamic user ID if needed
  const navigate = useNavigate(); 
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user;
  // Close cart when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartSidebarRef.current && !cartSidebarRef.current.contains(event.target)) {
        setIsCartOpen(false); // Close cart if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // Handle search action
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      try {
        const response = await fetch(`https://buyfishapi.onrender.com/api/shop/search/${searchKeyword}`);
        const data = await response.json();
        if (data.success) {
          onSearch(data.data); // Send results to parent component
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">BuyFish</div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-500">
            Our Products
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">
            About Us
          </Link>

          {/* Orders Tab */}
          {isAuthenticated && (
            <Link
              to={`/orders/${userId.toString()}`} // Navigate to OrderPage with userId
              className="text-gray-700 hover:text-blue-500"
            >
              Orders
            </Link>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-white bg-blue-500 rounded-r hover:bg-blue-600"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Cart Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsCartOpen(true)}
          >
            Cart
          </button>

          {/* Conditional Rendering for Sign In / Sign Out */}
          {isAuthenticated ? (
            <button
              className="bg-gray-100 text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
              onClick={handleLogout} // Logout action
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-gray-100 text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => navigate("/login")} // Navigate to login page
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div ref={cartSidebarRef}>
          <CartSidebar
            onClose={() => setIsCartOpen(false)} // Close the Cart Sidebar
           Id
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
