import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import axios from "axios";

const ServiceProvider = () => {

  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('services');

  const [providerData, setProviderData] = useState('')

  useEffect(() => {
    const fetchProviderById = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/servicehub/provider/${id}`
        );
        setProviderData(response.data)
      } catch (error) {
        console.error('Failed to fetch provider', error);
      }
    };

    fetchProviderById();
  }, []);

  // console.log("provider", providerData)


  const serviceFilter = localStorage.getItem("serviceFilter")?.toLowerCase().trim();

const test = providerData?.services || [];

const test1 = test.filter(data => data.service_name?.toLowerCase().trim() === serviceFilter);



const subservce = test1[0]?.subservices || []

const allSubservices = subservce.filter(data => data.status);

console.log("filter", test1);



  // const allSubservices = test1?.flatMap(service => service.subservices)
    

  localStorage.setItem("allSubservices", JSON.stringify(allSubservices))
  localStorage.setItem("provider", JSON.stringify(providerData?.provider))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto p-4">
          <div className="bg-white shadow rounded p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="text-5xl mr-4">👨‍🔧</div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {providerData?.provider?.company_name}
                  </h2>
                  <div className="flex items-center flex-wrap space-x-2 text-sm text-gray-500">
                    <div className="flex items-center text-yellow-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.188 3.657a1 1 0 00.95.69h3.847c.969 0 1.371 1.24.588 1.81l-3.115 2.26a1 1 0 00-.363 1.118l1.188 3.657c.3.921-.755 1.688-1.54 1.118L10 14.011l-3.115 2.26c-.784.57-1.839-.197-1.539-1.118l1.188-3.657a1 1 0 00-.363-1.118l-3.115-2.26c-.783-.57-.38-1.81.588-1.81h3.847a1 1 0 00.95-.69l1.188-3.657z" />
                      </svg>
                      {providerData?.provider?.ratings}
                    </div>
                    <span>{providerData?.reviews?.length} Reviews</span>
                    <span>• {providerData?.provider?.city}, {providerData?.provider?.state}</span>
                  </div>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs mt-2">
                    Available
                  </span>
                </div>
              </div>

              <div>
                <Link to={"/appointmentBooking"}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>

            <div>
              <div className="mt-4 border-b border-gray-200">
                <nav className="flex space-x-6 text-gray-600">
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`py-2 ${activeTab === 'services'
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                      : 'hover:text-blue-600'
                      }`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-2 ${activeTab === 'reviews'
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                      : 'hover:text-blue-600'
                      }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-2 ${activeTab === 'about'
                      ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                      : 'hover:text-blue-600'
                      }`}
                  >
                    About
                  </button>
                </nav>
              </div>
              <div className="mt-6 space-y-4">
                {activeTab === 'services' && (
                  <div>
                    {allSubservices.map((subservice, index) => (
                      <div key={index} className="flex items-center justify-between m-4">
                        <div>
                          <h3 className="font-semibold text-lg">{subservice.subservice_name}</h3>
                          {subservice.description && (
                            <p className="text-sm text-gray-600">
                              {subservice.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">${subservice.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {providerData?.reviews?.length > 0 ? (
                      providerData.reviews.map((review, index) => (
                        <div key={index} className="border p-4 m-4 rounded">
                          <p className="font-semibold">Customer #{review.customer_id}</p>
                          <p className="text-sm text-gray-600">
                            {review.comment || "No comment provided."}
                          </p>
                          <p className="text-sm text-yellow-500 font-bold">
                            ⭐ {review.rating} / 5
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 mt-4">
                        No reviews yet.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <p>
                      {providerData?.provider?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceProvider;
