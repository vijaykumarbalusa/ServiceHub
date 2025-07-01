import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import SearchBar from "./SearchBar";
import ServiceCards from "./ServiceCards";
import Footer from "./Footer";

const HomePage = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState("");

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="text-center py-10 bg-blue-100">
          <h1 className="text-4xl font-bold text-gray-800">
            Find Trusted Local Service Providers
          </h1>
          <p className="text-gray-600 mt-4">
            Connect with skilled professionals for all your home service needs
          </p>
          <SearchBar
            serviceValue={serviceQuery}
            onServiceChange={setServiceQuery}
          />
        </div>
        <ServiceCards serviceFilter={serviceQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
