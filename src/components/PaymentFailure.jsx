import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentFailure = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");

  useEffect(() => {
    // You can perform additional actions like notifying the user of the failure
    console.log("Payment Failed for Order ID:", orderId);
  }, [orderId]);

  return (
    <div>
      <h1>Payment Failed!</h1>
      <p>Your payment for Order ID: {orderId} has failed. Please try again.</p>
    </div>
  );
};

export default PaymentFailure;
