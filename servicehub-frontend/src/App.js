import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ServiceProvider from "./components/serviceProvider.js";
import ProviderList from "./components/providerList";
import AppointmentBookingPage from "./components/appintmentBooking.js";
import PaymentDetailsPage from "./components/paymentPage.js"
import MyAppointmentsPage from "./components/myAppointments.js";
import ProviderDashboard from "./components/providerDashboard.js";
import ProfilePage from "./components/profilePage.js";
import ReviewSubmissionPage from "./components/reviewSubmission.js";
import ChangePasswordPage from "./components/changePassword.js";
import AdminDashboardPage from "./components/adminDashboard.js";
import AboutPage from "./components/aboutPage.js";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/mybookings" element={<MyAppointmentsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<HomePage />} />
      <Route path="/providers" element={<ProviderList />} />
      <Route path="/serviceProvider/:id" element={<ServiceProvider />} />
      <Route path="/appointmentBooking" element={<AppointmentBookingPage />} />
      <Route path="/payment" element={<PaymentDetailsPage />} />
      <Route path="/myAppointments" element={<MyAppointmentsPage />} />
      <Route path="/providerDashboard" element={<ProviderDashboard />} />
      <Route path="/profilePage" element={<ProfilePage />} />
      <Route path="/reviewSubmission" element={<ReviewSubmissionPage />} />
      <Route path="/changePassword" element={<ChangePasswordPage />} />
      <Route path="/adminDashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default App;
