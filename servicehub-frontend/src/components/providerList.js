import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

const ProviderListPage = () => {
  const [searchParams] = useSearchParams();
  const serviceFilter = searchParams.get("service") || "";
  localStorage.setItem("serviceFilter", serviceFilter)

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/servicehub/providers/service/${serviceFilter}`
        );
        setProviders(response.data);
      } catch (error) {
        console.error('Failed to fetch providers', error);
      }
    };
  
    fetchProviders();
  }, [serviceFilter]);
  

  // console.log("prvider list ", providers)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="bg-gray-100 p-4 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">
          Service Providers
        </h1>
        {serviceFilter && (
          <p className="text-center mb-4">
            Filtering providers for: {serviceFilter}
          </p>
        )}
        <div className="flex flex-col gap-4">
          {providers.map((provider) => (
            <div
              key={provider.user_id}
              className="bg-white shadow-md rounded-lg p-4 w-[800px] mx-auto"
            >
              <div className="grid grid-cols-3 items-center">
                <div>
                  <h2 className="text-lg font-bold">{provider.first_name}</h2>
                  <p className="text-gray-600 text-sm">{serviceFilter}</p>
                </div>
                <div className="text-center">
                  <span className="text-yellow-500 text-xl font-bold">
                    {provider.ratings}
                  </span>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-right">
                  <Link to={`/serviceProvider/${provider.provider_id}`}>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderListPage;
