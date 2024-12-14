import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Redirect to home page if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
  });
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  useEffect(() => {
    if (userId) {
      // Fetch cart items
      fetch(`https://buyfishapi.onrender.com/api/shop/cart/get/${userId}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            setCartItems(response.data.items || []);
            setTotal(
              response.data.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )
            );
          }
        })
        .catch((error) => console.error("Error fetching cart items:", error));

      // Fetch saved addresses
      fetch(`https://buyfishapi.onrender.com/api/shop/address/get/${userId}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            setAddresses(response.data || []);
          }
        })
        .catch((error) => console.error("Error fetching addresses:", error));
    }
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
        if (!response.success) {
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
        if (!response.success) {
          console.error("Failed to remove product:", response.message);
        }
      })
      .catch((error) => console.error("Error removing product:", error));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const url = addressToEdit
      ? `https://buyfishapi.onrender.com/api/shop/address/update/${userId}/${addressToEdit}`
      : `https://buyfishapi.onrender.com/api/shop/address/add`;

    fetch(url, {
      method: addressToEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAddress, userId }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          if (addressToEdit) {
            setAddresses((prevAddresses) =>
              prevAddresses.map((address) =>
                address._id === addressToEdit ? { ...address, ...newAddress } : address
              )
            );
          } else {
            setAddresses([...addresses, response.data]);
          }
          setNewAddress({
            address: "",
            city: "",
            pincode: "",
            phone: "",
            notes: "",
          });
          setAddressToEdit(null);
        }
      })
      .catch((error) => console.error("Error adding/updating address:", error));
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address._id);
    setNewAddress({
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      phone: address.phone,
      notes: address.notes,
    });
  };

  const handleRemoveAddress = (addressId) => {
    fetch(`https://buyfishapi.onrender.com/api/shop/address/delete/${userId}/${addressId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setAddresses((prevAddresses) =>
            prevAddresses.filter((address) => address._id !== addressId)
          );
        }
      })
      .catch((error) => console.error("Error removing address:", error));
  };

  const handleCheckout = async () => {
    if (!currentSelectedAddress) {
      alert("Please select an address to proceed.");
      return;
    }

    const orderPayload = {
      userId,
      cartItems,
      addressInfo: currentSelectedAddress,
      orderStatus: "pending",
      paymentMethod: "online",
      totalAmount: total,
      orderDate: new Date().toISOString(),
      orderUpdateDate: new Date().toISOString(),
      cartId: userId, // Ensure this is fetched from the correct cart object
    };

    try {
      const res = await fetch("https://buyfishapi.onrender.com/api/shop/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const response = await res.json();

      if (response.success) {
        window.location.href = response.approvalURL; // Redirect to payment gateway
      } else {
        alert(`Failed to create order: ${response.message}`);
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left Section */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* Saved Addresses */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Saved Addresses</h2>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address._id} className="border-b pb-2 mb-2">
                <p>{address.address}</p>
                <p>{address.city}, {address.pincode}</p>
                <p>{address.phone}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCurrentSelectedAddress(address)}
                    className={`text-blue-500 hover:text-blue-700 ${
                      currentSelectedAddress?._id === address._id ? "font-bold" : ""
                    }`}
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveAddress(address._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
        </div>

        {/* Add/Update Address */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Add/Update Address</h2>
          <form onSubmit={handleAddAddress} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Notes"
              value={newAddress.notes}
              onChange={(e) => setNewAddress({ ...newAddress, notes: e.target.value })}
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
              {addressToEdit ? "Update Address" : "Add Address"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Cart Items</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.productId} className="border-b pb-2 mb-2">
                <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.productId, "decrease")}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.productId, "increase")}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveProduct(item.productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

        {/* Checkout Button */}
        <div className="mt-4">
          <p>Total: ${total}</p>
          <button onClick={handleCheckout} className="bg-blue-500 text-white p-2 rounded mt-4">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
