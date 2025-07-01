import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const ProfilePage = () => {
  const navigate = useNavigate();

  // 1) Read user once
  const stored = JSON.parse(localStorage.getItem("user")) || {};

  // 2) Initialize state from that
  const [profile, setProfile] = useState({
    first_name:   stored.first_name   || "",
    last_name:    stored.last_name    || "",
    email:        stored.email        || "",
    phone_number: stored.phone_number || "",
    address:      stored.address      || "",
    city:         stored.city         || "",
    zip_code:     stored.zip_code     || "",
    role:         stored.role         || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:5000/servicehub/updateProfile/${stored.user_id}`,
        {
          first_name:   profile.first_name,
          last_name:    profile.last_name,
          email:        profile.email,
          phone_number: profile.phone_number,
          address:      profile.address,
          city:         profile.city,
          zip_code:     profile.zip_code,
        }
      );
      localStorage.setItem("user", JSON.stringify({ ...stored, ...profile }));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className="pt-[80px] pb-[80px] container mx-auto px-4 flex-grow overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
            Manage Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name
                </label>
                <input
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Last Name
                </label>
                <input
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  City
                </label>
                <input
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ZIP & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ZIP Code
                </label>
                <input
                  name="zip_code"
                  value={profile.zip_code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Role
                </label>
                <input
                  name="role"
                  value={profile.role}
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="text-center mt-10 flex justify-center gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-gray-300 text-gray-800 px-10 py-3 rounded-xl text-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
