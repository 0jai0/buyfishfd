import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/auth-slice"; // Import login action

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orderDetails, setOrderDetails] = useState(null);
  const [isPaymentSuccess, setPaymentSuccess] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch order details based on orderId passed in location
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://buyfishapi.onrender.com/api/shop/order/details/${location.state.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in request
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOrderDetails(data.data);
        } else {
          console.error("Failed to fetch order details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (location.state && location.state.orderId) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, location.state, navigate]);

  const handlePaymentSuccess = async (paymentId, payerId) => {
    try {
      const response = await fetch("https://buyfishapi.onrender.com/api/shop/order/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in request
        },
        body: JSON.stringify({
          paymentId,
          payerId,
          orderId: orderDetails._id,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setPaymentSuccess(true);

        // Revalidate token (optional)
        if (result.token && result.user) {
          localStorage.setItem("token", result.token); // Persist new token if provided
          localStorage.setItem("user", JSON.stringify(result.user));
          dispatch(login({ token: result.token, user: result.user }));
        }
      } else {
        console.error("Payment capture failed:", result.message);
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
    }
  };

  if (!orderDetails) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order Summary</h1>
      <div>
        <h2>Order ID: {orderDetails._id}</h2>
        <h3>Total: ${orderDetails.totalAmount}</h3>
        <ul>
          {orderDetails.cartItems.map((item) => (
            <li key={item.productId}>
              {item.title} x {item.quantity} - ${item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>

      {!isPaymentSuccess ? (
        <div>
          <h2>Pay with PayPal</h2>
          <button onClick={() => handlePaymentSuccess("fakePaymentId", "fakePayerId")}>
            Complete Payment
          </button>
        </div>
      ) : (
        <div>
          <h2>Payment Successful!</h2>
          <button onClick={() => navigate("/orders")}>View Orders</button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
