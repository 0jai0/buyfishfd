import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Products = ({ selectedCategories, searchResults }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = user?.id;

  // Fetch products when necessary
  useEffect(() => {
    if (!searchResults) {
      fetch("https://buyfishapi.onrender.com/api/shop/products/get")
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data) {
            setProducts(response.data);
          } else {
            console.error("Failed to fetch products:", response.message);
          }
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [searchResults]);

  // Filter products based on selected categories or use search results
  const filteredProducts =
    searchResults ||
    (selectedCategories?.length
      ? products.filter((product) =>
          selectedCategories.includes(product.category)
        )
      : products);

  // Add product to the cart
  const handleAddToCart = (productId, quantity) => {
    if (!isAuthenticated) {
      // Redirect to login if user is not authenticated
      navigate("/login");
      return;
    }

    fetch("https://buyfishapi.onrender.com/api/shop/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId, // Replace with dynamic userId if necessary
        productId,
        quantity,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          alert("Item added to cart!");
          setCart((prevCart) => ({
            ...prevCart,
            [productId]: { quantity },
          }));
        } else {
          console.error("Failed to add item:", response.message);
        }
      })
      .catch((error) => console.error("Error adding item to cart:", error));
  };

  // Update cart quantity
  const handleQuantityChange = (productId, action) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const productInCart = newCart[productId] || { quantity: 0 };

      if (action === "increase") {
        productInCart.quantity += 1;
      } else if (action === "decrease" && productInCart.quantity > 0) {
        productInCart.quantity -= 1;
      }

      newCart[productId] = productInCart;

      fetch("https://buyfishapi.onrender.com/api/shop/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: productInCart.quantity }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (!response.success) {
            console.error("Failed to update cart:", response.message);
          }
        })
        .catch((error) => console.error("Error updating cart:", error));

      return newCart;
    });
  };

  // Render products
  return (
    <section>
      {/* Product Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{filteredProducts.length} Items</h2>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
            <i className="fas fa-sort"></i>
          </button>
          <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
            <i className="fas fa-th"></i>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const quantityInCart = cart[product._id]?.quantity || 0;

            return (
              <div
                key={product._id}
                className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-4">{product.title}</h3>
                <p className="text-blue-600 font-bold mt-2">${product.price}</p>

                <div className="flex items-center mt-4">
                  <button
                    onClick={() => handleQuantityChange(product._id, "decrease")}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={quantityInCart <= 0}
                  >
                    -
                  </button>
                  <span className="mx-4">{quantityInCart}</span>
                  <button
                    onClick={() => handleQuantityChange(product._id, "increase")}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  onClick={() => handleAddToCart(product._id, quantityInCart || 1)}
                >
                  Add to Cart
                </button>
              </div>
            );
          })
        ) : (
          <p>No products available for the selected categories.</p>
        )}
      </div>
    </section>
  );
};

export default Products;
