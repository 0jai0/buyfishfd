import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartSidebar = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = user?.id;
  const fetchCartItems = () => {
    if(!isAuthenticated) return;
    setLoading(true);
    fetch(`https://buyfishapi.onrender.com/api/shop/cart/get/${userId}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setCartItems(response.data.items || []);
        } else {
          console.error("Failed to fetch cart items:", response.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = (productId, action) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: action === "increase" ? item.quantity + 1 : Math.max(item.quantity - 1, 1),
          }
        : item
    );
    setCartItems(updatedCart);

    fetch("https://buyfishapi.onrender.com/api/shop/cart/update-cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity: updatedCart.find((item) => item.productId === productId).quantity,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log("Cart updated successfully");
        } else {
          console.error("Failed to update cart:", response.message);
        }
      })
      .catch((error) => console.error("Error updating cart:", error));
  };

  const handleRemoveProduct = (productId) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);

    fetch(`https://buyfishapi.onrender.com/api/shop/cart/${userId}/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log("Product removed successfully");
        } else {
          console.error("Failed to remove product:", response.message);
        }
      })
      .catch((error) => console.error("Error removing product:", error));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { userId } });
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-black bg-opacity-30 z-50">
      <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <h3 className="text-lg font-bold">Your Cart</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p>Loading...</p>
          ) : cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center mb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 ml-4">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    ${item.price} x {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() => handleQuantityChange(item.productId, "decrease")}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="bg-gray-200 p-2 rounded"
                      onClick={() => handleQuantityChange(item.productId, "increase")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveProduct(item.productId)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="px-4 py-4 border-t">
          <p className="font-bold mb-2">Total: ${total.toFixed(2)}</p>
          <button
            className="bg-blue-500 text-white py-2 w-full rounded"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
