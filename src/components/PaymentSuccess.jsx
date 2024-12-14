import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/auth-slice"; // Import the login action if needed to restore session

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check authentication state
    if (!isAuthenticated) {
      if (token) {
        // Restore session if token exists
        const user = JSON.parse(localStorage.getItem("user")); // Or decode token if needed
        dispatch(login({ token, user }));
      } else {
        // Redirect to login if no token
        navigate("/login");
        return;
      }
    }

    // Log payment success for Order ID
    console.log("Payment Successful for Order ID:", orderId);
    const timeout = setTimeout(() => {
      navigate("/orders");
    }, 3000); // Adjust delay as needed (e.g., 3 seconds)

    return () => clearTimeout(timeout); 
    // Optionally, you can update the order status on the backend here
    // Example: sendOrderStatusUpdate(orderId);

  }, [isAuthenticated, orderId, dispatch, navigate]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your payment for Order ID: {orderId} was successful. Thank you for your purchase!</p>
    </div>
  );
};

export default PaymentSuccess;
