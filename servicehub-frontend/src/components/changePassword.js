import React, { useState } from "react";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    
    alert("Password changed successfully!");
  };

  const EyeIcon = ({ isVisible }) => {
    return isVisible ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 3C6.691 3 3.588 4.986 1 8c2.588 3.014 5.691 5 9 5 3.308 0 6.411-1.986 9-5-2.589-3.014-5.692-5-9-5zm0 8a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Change Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowCurrent((prev) => !prev)}
              >
                <EyeIcon isVisible={showCurrent} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowNew((prev) => !prev)}
              >
                <EyeIcon isVisible={showNew} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                <EyeIcon isVisible={showConfirm} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
