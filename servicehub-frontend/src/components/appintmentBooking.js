import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const AppointmentBookingPage = () => {
  const navigate = useNavigate();

  // Form State
  const [service, setService] = useState("");
  const [selectedDate, setSelectedDate] = useState("2025-03-25");
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [notes, setNotes] = useState("");

  // Backend Related IDs
  const [customerId, setCustomerId] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [subServiceId, setSubServiceId] = useState(null);
  const [allSubservices, setAllSubservices] = useState([]);
  const [serviceFee, setServiceFee] = useState(0.0);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    const providerFromStorage = localStorage.getItem("provider");
    const subservicesFromStorage = localStorage.getItem("allSubservices");

    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setCustomerId(parsedUser.customer_id);
    }

    if (providerFromStorage) {
      const parsedProvider = JSON.parse(providerFromStorage);
      setProviderId(parsedProvider.provider_id);
    }

    if (subservicesFromStorage) {
      const parsedSubservices = JSON.parse(subservicesFromStorage);
      setAllSubservices(parsedSubservices);

      if (parsedSubservices.length > 0) {
        setService(parsedSubservices[0].subservice_name);
        setServiceFee(parsedSubservices[0].price);
        setServiceId(parsedSubservices[0].service_id);
      }
    }
  }, []);

  const formatSelectedTime = (timeStr) => {
    const [hourMin, period] = timeStr.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  };

  const getSubserviceId = (subservices, service) => {
    const matched = subservices.find(sub => sub.subservice_name === service);
    return matched ? matched.subservice_id : null;
  };

  const handleBookNow = async () => {

    const selectedSubservice = allSubservices.find(
        (sub) => sub.subservice_name === service
      );
      console.log("okok", selectedSubservice)
      if (selectedSubservice) {
        console.log("selected ", selectedSubservice)
        setServiceFee(selectedSubservice.price);
        setServiceId(selectedSubservice.service_id);
        setSubServiceId(selectedSubservice.subservice_id);

        console.log(subServiceId)
      }

    try {
      await axios.post("http://127.0.0.1:5000/servicehub/createbooking", {
        customer_id: customerId,
        provider_id: providerId,
        service_id: serviceId,
        service_name: service,
        address: address,
        city: city,
        state: state,
        zip_code: zipCode,
        note: notes,
        total_cost: serviceFee,
        booking_time: formatSelectedTime(selectedTime),
        status: "pending",
        subservice_id: subServiceId ? serviceId : getSubserviceId(allSubservices, service)
      });

      navigate("/payment");

    } catch (error) {
      console.error("Failed to create booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 flex-grow py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Book an Appointment
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded shadow p-6 transform transition duration-300 hover:shadow-2xl">

            {/* Service Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Select Service
              </label>
              <select
                value={service}
                onChange={(e) => {
                  const selectedServiceName = e.target.value;
                  setService(selectedServiceName);

                  const selectedSubservice = allSubservices.find(
                    (sub) => sub.subservice_name === selectedServiceName
                  );
                  if (selectedSubservice) {
                    console.log("selected ", selectedSubservice)
                    setServiceFee(selectedSubservice.price);
                    setServiceId(selectedSubservice.service_id);
                    setSubServiceId(selectedSubservice.subservice_id);
                  } else {
                    setServiceFee(0.0);
                    setServiceId(null);
                  }
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Select a Service --</option>
                {allSubservices.map((subservice) => (
                  <option
                    key={subservice.subservice_id}
                    value={subservice.subservice_name}
                  >
                    {subservice.subservice_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Time Slots */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`border rounded px-3 py-2 text-sm transition-colors ${
                      selectedTime === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Zip Code"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions or details..."
                className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-start h-fit transform transition duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <div className="text-5xl mb-2">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1 text-center">
                {service || "Select a Service"}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Service Provider
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Time:</span>
                <span className="font-semibold text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Service Fee:</span>
                <span className="font-bold text-green-600 text-base">
                  ${serviceFee.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Book Now
            </button>

            <p className="text-center text-gray-400 text-xs mt-3">
              Free cancellation up to 24 hours before appointment
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentBookingPage;
