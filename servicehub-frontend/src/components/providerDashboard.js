import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [providerData, setProviderData] = useState("");
  const [updated, setUpdated] = useState(1);
  const [description, setDescription] = useState("");
  const [subServiceStatus, setsubServiceStatus] = useState([])


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [subservices, setSubservices] = useState([{ name: "" }]);

  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/servicehub/bookings/provider/${userFromStorage.provider_id}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch provider bookings", error);
      }
    };

    const fetchProviderById = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/servicehub/provider/${userFromStorage.provider_id}`
        );
        setProviderData(response.data);
      } catch (error) {
        console.error("Failed to fetch provider", error);
      }
    };

    fetchProviderById();
    fetchProviders();
  }, [updated]);

  const allservices = providerData?.services || [];

  const allServices = allservices.map(service => ({
    ...service,
    subservices: service.subservices.filter(sub => sub.status)
  }));



  const handleManageServices = async (serviceData) => {
    console.log("data", serviceData, subServiceStatus)
    if (serviceData.action == "update") {
      serviceData?.subservices?.push(...subServiceStatus)
      try {
        await axios.put(
          `http://127.0.0.1:5000/servicehub/updateservice`,
          serviceData
        );
        alert("Service updated successfully!");
        setUpdated(updated + 1)
      } catch (error) {
        console.error("Failed to update service", error);
        alert("Update failed!");
      }
      setsubServiceStatus([])
    }

    if (serviceData.action == "add") {
      serviceData.provider_id = userFromStorage.provider_id
      try {
        await axios.put(
          `http://127.0.0.1:5000/servicehub/updateservice`,
          serviceData
        );
        alert("Service updated successfully!");
        setUpdated(updated + 1)
      } catch (error) {
        console.error("Failed to add service", error);
        alert("Update failed!");
      }
      setsubServiceStatus([])
    }

  }

  const today = new Date().toLocaleDateString('en-CA').split("T")[0];

  const todaysAppointments = bookings.filter(
    ({ booking_date, status }) =>
      booking_date.split("T")[0] === today &&
      (status === "pending" || status === "started")
  );


  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    let [hour, minute] = timeStr.split(":");
    hour = parseInt(hour, 10);

    if (isNaN(hour) || !minute) return timeStr;

    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute} ${ampm}`;
  };

  const handleStartAppointment = async (data) => {
    console.log("Starting appointment with booking ID:", data);

    try {
      await axios.put(
        `http://127.0.0.1:5000/servicehub/updatebooking`,
        data
      );
      alert("Booking updated successfully!");
      setUpdated(updated + 1);
    } catch (error) {
      console.error("Failed to update booking", error);
      alert("Update failed!");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <main className="pt-[100px] pb-[100px] container mx-auto px-6 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10 tracking-wide">
          Provider Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">
              Today's Bookings
            </p>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">
              {todaysAppointments.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">
              Active Services
            </p>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">
              {allServices.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
            <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">
              Overall Rating
            </p>
            <p className="text-4xl font-extrabold text-yellow-500 mb-2">
              {userFromStorage.ratings}
            </p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Today's Appointments
          </h2>

          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 text-gray-700 font-semibold">Time</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Customer</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Service</th>
                  <th className="py-3 px-4 text-center text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todaysAppointments.map((appt, index) => (
                  <tr key={appt.booking_id} className="hover:bg-gray-100">
                    <td className="py-3 px-4">{formatTime(appt.booking_time)}</td>
                    <td className="py-3 px-4">{appt.customer_name}</td>
                    <td className="py-3 px-4">{appt.service_name}</td>
                    <td className="py-3 px-4 text-center">
                      {index === 0 ? (
                        appt.status === "pending" ? (
                          <button
                            onClick={() => handleStartAppointment({ booking_id: appt.booking_id, status: "started" })}
                            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                          >
                            Start
                          </button>
                        ) : appt.status === "started" ? (
                          <button
                            onClick={() => handleStartAppointment({ booking_id: appt.booking_id, status: "completed" })}
                            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
                          >
                            Complete
                          </button>
                        ) : (
                          <span className="inline-block bg-gray-200 text-gray-800 px-5 py-2 rounded-full">
                            Upcoming
                          </span>
                        )
                      ) : (
                        <span className="inline-block bg-gray-200 text-gray-800 px-5 py-2 rounded-full">
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {todaysAppointments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No appointments for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Availability */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Service Availability
          </h2>
          <p className="text-gray-600 mb-6">
            You are currently showing as available for new bookings.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
            >
              Manage Services
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-5xl p-8 rounded-2xl shadow-2xl flex">

            {/* Left Side - Service List */}
            <div className="w-1/3 pr-6 border-r overflow-y-auto max-h-[70vh]">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Current Services</h3>
              {allServices.length === 0 ? (
                <p className="text-gray-500">No services available.</p>
              ) : (
                allServices.map((service, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedService(service);
                      setServiceName(service.service_name);
                      setDescription(service.description || "");
                      setSubservices(
                        service.subservices.map(sub => ({
                          subservice_id: sub.subservice_id,
                          service_id: sub.service_id,
                          subservice_name: sub.subservice_name,
                          price: sub.price,
                          status: sub.status
                        }))
                      );
                    }}
                    className="cursor-pointer p-3 rounded-lg hover:bg-blue-100 transition mb-2"
                  >
                    {service.service_name}
                  </div>
                ))
              )}
            </div>

            {/* Right Side - Form */}
            <div className="w-2/3 pl-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600">
                {selectedService ? "Update Service" : "Add New Service"}
              </h3>

              {/* Service Name */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Service Name"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Description"
                  rows={3}
                />
              </div>

              {/* Subservices (Name + Price) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subservices</label>
                {subservices.map((sub, idx) => (
                  <div key={idx} className="flex items-center mb-2 space-x-2">
                    <input
                      type="text"
                      value={sub.subservice_name}
                      onChange={(e) => {
                        const updatedSubs = [...subservices];
                        updatedSubs[idx].subservice_name = e.target.value;
                        setSubservices(updatedSubs);
                      }}
                      className="w-1/2 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Subservice Name"
                    />
                    <input
                      type="number"
                      value={sub.price}
                      onChange={(e) => {
                        const updatedSubs = [...subservices];
                        updatedSubs[idx].price = parseFloat(e.target.value);
                        setSubservices(updatedSubs);
                      }}
                      className="w-1/2 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Price"
                    />
                    <button
                      onClick={() => {
                        setsubServiceStatus((prev) =>
                          [...prev, {
                            subservice_id: sub.subservice_id,
                            service_id: selectedService?.service_id,
                            subservice_name: sub.subservice_name,
                            price: sub.price,
                            status: 0
                          }]
                        )
                        const updatedSubs = subservices.filter((_, i) => i !== idx);
                        setSubservices(updatedSubs);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSubservices([...subservices, { subservice_name: "", price: "", status: 1 }])}
                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                >
                  Add Subservice
                </button>
              </div>

              {/* Save / Cancel Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    const serviceData = {
                      service_id: selectedService?.service_id,
                      service_name: serviceName,
                      description: description,
                      price: parseFloat(selectedService?.price) || 0.0,
                      subservices: subservices.map(sub => ({
                        subservice_id: sub.subservice_id,
                        service_id: selectedService?.service_id,
                        subservice_name: sub.subservice_name,
                        price: sub.price,
                        status: sub.status
                      })),
                      action: selectedService ? "update" : "add"
                    };

                    handleManageServices(serviceData);
                    setIsModalOpen(false);
                    setSelectedService(null);
                    setServiceName("");
                    setDescription("");
                    setSubservices([{ subservice_name: "", price: "", status: "" }]);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {selectedService ? "Update Service" : "Add Service"}
                </button>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                    setServiceName("");
                    setDescription("");
                    setSubservices([{ subservice_name: "", price: "", status: "" }]);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderDashboard;
