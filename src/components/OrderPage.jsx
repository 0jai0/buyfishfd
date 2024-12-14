import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams for dynamic routing
import { useSelector } from "react-redux";

const OrderPage = () => {
  //const { user } = useParams(); 
  //const userId = "67569cb4830a409fb85ce166"; // Replace with dynamic ID if needed
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = user?.id;
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://buyfishapi.onrender.com/api/shop/order/list/${userId}`);
        console.log("Response Status:", response.status); // Log the response status

        if (!response.ok) {
          throw new Error("Orders API call failed");
        }

        const data = await response.json();
        console.log("Fetched Orders Data:", data); // Log the full response

        if (data.success && Array.isArray(data.data)) {
          // Filter orders with paymentStatus === "paid"
          const paidOrders = data.data.filter((order) => order.paymentStatus === "paid");
          if (paidOrders.length === 0) {
            setError("You have no orders with payment completed yet. Start shopping to place your first order!");
          } else {
              const sortedOrders = paidOrders.sort(
                (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
              );
              setOrders(sortedOrders);
          }
        } else {
          setError("You have no orders yet. Start shopping to place your first order!");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("You have no orders yet. Start shopping to place your first order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, userId, navigate]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div className="text-gray-500">{error}</div> // Show the error message
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded hover:shadow-lg">
              <div className="font-semibold">Order ID: {order._id}</div>
              <div>Order Status: {order.orderStatus}</div>
              <div>Payment Method: {order.paymentMethod}</div>
              <div>Payment Status: {order.paymentStatus}</div>
              <div>Total: ${parseFloat(order.totalAmount).toFixed(2)}</div>
              <div>Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
              <div className="mt-2">
                <h4 className="font-bold">Cart Items:</h4>
                {order.cartItems.map((item) => (
                  <div key={item.productId} className="ml-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 inline-block mr-2" />
                    <span>{item.title} - ${item.price} x {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No orders with payment completed yet.</div>
      )}
    </div>
  );
};

export default OrderPage;
