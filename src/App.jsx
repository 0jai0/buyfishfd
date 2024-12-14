import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Features from "./components/Features";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import OrderPage from "./components/OrderPage";
import CartSidebar from "./components/CartSidebar";
import CheckoutPage from "./components/CheckoutPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailure from "./components/PaymentFailure";
import Login from "./components/Login";
import Register from "./components/Register";
import { Skeleton } from "./components/ui/skeleton";
import { checkAuth } from "./store/auth-slice";
const App = () => {
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // Restore authentication on app load
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    setSearchResults(null);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  return (
    <Router>
      <div>
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Features />
                <section className="py-12 px-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Categories */}
                    <div className="w-full md:w-1/3">
                      <Categories onCategorySelect={handleCategorySelect} />
                    </div>

                    {/* Products */}
                    <div className="w-full md:w-2/3">
                      <Products
                        selectedCategories={selectedCategories}
                        searchResults={searchResults}
                      />
                    </div>
                  </div>
                </section>
                <Reviews />
                <Footer />
              </>
            }
          />

          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

          <Route
            path="/orders/:userId"
            element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={isAuthenticated ? <CartSidebar /> : <Navigate to="/login" />}
          />

          <Route
            path="/payment-success"
            element={isAuthenticated ? <PaymentSuccess /> : <Navigate to="/login" />}
          />
          <Route
            path="/payment-failure"
            element={isAuthenticated ? <PaymentFailure /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
