import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const PaymentDetailsPage = () => {
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    address: "",
    city: "",
    zip: "",
  });

  const [touched, setTouched] = useState({}); // Track which fields are touched

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      alert("Payment processed successfully!");
      navigate("/myAppointments");
    } else {
      alert("Please fill out the form correctly!");
    }
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case "cardNumber":
        return /^\d{16}$/.test(value.replace(/\s/g, ""));
      case "expiration":
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
      case "cvv":
        return /^\d{3}$/.test(value);
      case "address":
        return value.trim() !== "";
      case "city":
        return /^[A-Za-z\s]+$/.test(value);
      case "zip":
        return /^\d{5}$/.test(value);
      default:
        return true;
    }
  };

  const isFormValid = () => {
    return Object.keys(paymentData).every((field) =>
      validateField(field, paymentData[field])
    );
  };

  const inputClass = (fieldName) => {
    if (!touched[fieldName]) return "border-gray-300";

    return validateField(fieldName, paymentData[fieldName])
      ? "border-green-500"
      : "border-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transform transition duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Payment Details
          </h2>

          <form onSubmit={handlePay} className="space-y-5">
            {/* Card Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="cardNumber">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1234567812345678"
                className={`w-full border ${inputClass("cardNumber")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
            </div>

            {/* Expiration and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="expiration">
                  Expiration
                </label>
                <input
                  id="expiration"
                  type="text"
                  name="expiration"
                  value={paymentData.expiration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MM/YY"
                  className={`w-full border ${inputClass("expiration")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="cvv">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123"
                  className={`w-full border ${inputClass("cvv")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="address">
                Billing Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={paymentData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="123 Main St"
                className={`w-full border ${inputClass("address")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
            </div>

            {/* City and Zip */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={paymentData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className={`w-full border ${inputClass("city")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="zip">
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  value={paymentData.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ZIP"
                  className={`w-full border ${inputClass("zip")} rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pay Now
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentDetailsPage;
