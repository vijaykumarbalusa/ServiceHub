import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [showAllPopup, setShowAllPopup] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/servicehub/bookings/withCustomer"
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/servicehub/performance"
        );
        const labels = response.data.map(item => item.service_name);
        const values = response.data.map(item => item.performance);
        setChartData({
          labels,
          datasets: [
            {
              label: "Performance (%)",
              data: values,
              backgroundColor: "rgba(37, 99, 235, 0.8)",
              hoverBackgroundColor: "rgba(29, 78, 216, 0.9)",
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchBookings();
    fetchChartData();
  }, []);

  const recentBookings = bookings.slice(0, 3);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Service Performance" },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50"><Header /></div>

      <main className="pt-[80px] pb-[80px] container mx-auto px-4 flex-grow overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-gray-600 font-medium">Customer</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Service</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Date</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {recentBookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.customer_name || "Unknown"}</td>
                    <td className="py-3 px-4">{booking.service_name || "-"}</td>
                    <td className="py-3 px-4">
                      {booking.booking_date
                        ? new Date(booking.booking_date).toLocaleDateString("en-US")
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() => setShowAllPopup(true)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View All Bookings
            </button>
          </div>
        </div>

        {/* Service Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>

      {showAllPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[80vh] relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              All Bookings
            </h2>
            <button
              onClick={() => setShowAllPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <table className="w-full text-left mt-2">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-gray-600 font-medium">Customer</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Service</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Date</th>
                  <th className="py-3 px-4 text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.customer_name || "Unknown"}</td>
                    <td className="py-3 px-4">{booking.service_name || "-"}</td>
                    <td className="py-3 px-4">
                      {booking.booking_date
                        ? new Date(booking.booking_date).toLocaleDateString("en-US")
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
