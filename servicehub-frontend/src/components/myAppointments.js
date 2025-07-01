import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const MyAppointmentsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [allSubservices, setAllSubservices] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editedBooking, setEditedBooking] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [updated, setUpdated] = useState(1)

    const userData = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subservicesFromStorage = [];
                // console.log("sub services", subservicesFromStorage);

                // const subServices = await axios.get(
                //     `http://127.0.0.1:5000/servicehub/allSubServices`
                // );

                // console.log("all subservices", subServices, userData.customer_id)
                // setAllSubservices(subServices.data);

                if (userData?.customer_id) {
                    const response = await axios.get(
                        `http://127.0.0.1:5000/servicehub/bookings/customer/${userData.customer_id}`
                    );
                    console.log("hello", response.data)
                    setBookings(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            }
        };
        fetchData();
    }, [updated]);


    const openPopup = async (booking) => {
        try {
            if (booking?.service_id) {
                const response = await axios.get(
                    `http://127.0.0.1:5000/servicehub/subservices/${booking?.service_id}`
                );
                console.log("bookings", response.data);

                setAllSubservices(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }



        setSelectedBooking(booking);

        setEditedBooking({
            ...booking
        });

        setShowPopup(true);
    };



    const closePopup = () => {
        setSelectedBooking(null);
        setEditedBooking({});
        setShowPopup(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // console.log("final data", editedBooking, bookings)
        try {
            await axios.put(
                `http://127.0.0.1:5000/servicehub/updatebooking`,
                editedBooking
            );
            alert("Booking updated successfully!");
            setUpdated(updated + 1)
            closePopup();
            //   window.location.reload();
        } catch (error) {
            console.error("Failed to update booking", error);
            alert("Update failed!");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";

        let [hour, minute] = timeStr.split(":");
        hour = parseInt(hour, 10);

        if (isNaN(hour) || !minute) return timeStr;

        const ampm = hour >= 12 ? "PM" : "AM";
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:${minute} ${ampm}`;
    };

    const formatTimeTo24Hrs = (timeStr) => {
        if (!timeStr) return "";

        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
    };

    const handleReview = async (bookingId, providerId) => {
        localStorage.setItem("reviewData", JSON.stringify({bookingId: bookingId, customerId: userData.customer_id, providerId: providerId}))
        try {
            await axios.put(
                `http://127.0.0.1:5000/servicehub/updatebooking`,
                {
                    booking_id: bookingId,
                    status: "Commented"
                }
            );
            navigate("/reviewSubmission")
        } catch (error) {
            console.error("Failed to update booking", error);
            alert("Update failed!");
        }
    }



    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            <main className="pt-20 pb-20 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Bookings</h1>

                {bookings.length === 0 ? (
                    <p className="text-center text-gray-600">You have no bookings yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.booking_id}
                                className="w-[800px] mx-auto bg-white rounded-2xl shadow-xl p-6 transform transition duration-300 hover:scale-105"
                            >
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{booking.service_name}</h2>
                                    <p className="text-lg text-gray-600">{booking.provider_name || "Provider Name"}</p>
                                    <p className="text-gray-500 text-sm">
                                        {booking.address}, {booking.city}, {booking.zip_code}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-700 font-medium">{formatDate(booking.booking_date)}</p>
                                        <p className="text-gray-700 text-lg">{formatTime(booking.booking_time)}</p>
                                    </div>
                                    <span
                                        className={`px-4 py-1 rounded-full text-sm font-semibold ${booking.status.toLowerCase() === "confirmed"
                                            ? "bg-green-200 text-green-800"
                                            : booking.status.toLowerCase() === "pending"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {booking.status.toLowerCase()}
                                    </span>
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center space-x-6">
                                    <button
                                        onClick={() => openPopup(booking)}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>

                                    {booking.status === "completed" && (
                                        <button
                                            onClick={() => handleReview(booking.booking_id, booking.provider_id)}
                                            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <Footer />
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8 relative transform transition-all duration-300">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            {selectedBooking.status.toLowerCase() === "pending" ? "Edit Booking" : "Booking Details"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 shadow-md">

                                {/* Service Dropdown */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-semibold mb-2">Service</label>
                                    <select
                                        value={editedBooking.service_name}
                                        onChange={(e) => {
                                            const selectedService = allSubservices.find(
                                                (service) => service.subservice_name === e.target.value
                                            );
                                            setEditedBooking({
                                                ...editedBooking,
                                                service_name: e.target.value,
                                                total_cost: selectedService ? selectedService.price : 0.0,
                                                subservice_id: selectedService ? selectedService.subservice_id : 0
                                            });
                                        }}
                                        disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="">-- Select a Service --</option>
                                        {allSubservices.map((service) => (
                                            <option key={service.subservice_id} value={service.subservice_name}>
                                                {service.subservice_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Picker */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formatDate(editedBooking.booking_date)}
                                        onChange={(e) => setEditedBooking({ ...editedBooking, booking_date: e.target.value })}
                                        disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>

                                {/* Time Selector */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-semibold mb-2">Time</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setEditedBooking({ ...editedBooking, booking_time: formatTimeTo24Hrs(time) })}
                                                disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                                className={`border rounded px-3 py-2 text-sm transition-colors ${editedBooking.booking_time === formatTimeTo24Hrs(time)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-semibold mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={editedBooking.address}
                                        onChange={(e) => setEditedBooking({ ...editedBooking, address: e.target.value })}
                                        disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>

                                {/* City and Zip Code */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                                        <input
                                            type="text"
                                            value={editedBooking.city}
                                            onChange={(e) => setEditedBooking({ ...editedBooking, city: e.target.value })}
                                            disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">ZIP Code</label>
                                        <input
                                            type="text"
                                            value={editedBooking.zip_code}
                                            onChange={(e) => setEditedBooking({ ...editedBooking, zip_code: e.target.value })}
                                            disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="mb-5">
                                    <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
                                    <textarea
                                        value={editedBooking.note}
                                        onChange={(e) => setEditedBooking({ ...editedBooking, note: e.target.value })}
                                        disabled={selectedBooking.status.toLowerCase() !== "pending"}
                                        placeholder="Any specific instructions..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="text-5xl mb-2">📋</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {editedBooking.service_name}
                                    </h3>
                                    <p className="text-gray-500 text-center text-sm">Service Appointment</p>
                                </div>

                                <div className="text-sm space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Date:</span>
                                        <span className="text-gray-900 font-semibold">
                                            {formatDate(editedBooking.booking_date)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Time:</span>
                                        <span className="text-gray-900 font-semibold">
                                            {formatTime(editedBooking.booking_time)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className="text-gray-900 font-semibold capitalize">
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Service Fee:</span>
                                        <span className="text-green-600 font-bold">
                                            ${editedBooking.total_cost ? editedBooking.total_cost.toFixed(2) : "0.00"}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-center text-gray-400 text-xs mt-3">
                                    Free cancellation up to 24h before appointment
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={closePopup}
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                            >
                                Close
                            </button>
                            {selectedBooking.status.toLowerCase() === "pending" && (
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default MyAppointmentsPage;
