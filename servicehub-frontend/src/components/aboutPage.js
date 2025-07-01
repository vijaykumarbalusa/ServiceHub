import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaBullseye, FaHandshake, FaUsers } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className="pt-[80px] pb-[80px] flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">About ServiceHub</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Connecting you with top local professionals, fast and hassle-free.
            Our mission is to empower communities by making quality service accessible to everyone.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <FaBullseye className="text-blue-600 mx-auto text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precision</h3>
              <p className="text-gray-600">
                We vet every provider to ensure top-quality workmanship and peace of mind.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <FaHandshake className="text-blue-600 mx-auto text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">
                Your trust is our priority. Transparent pricing and honest reviews keep us accountable.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition">
              <FaUsers className="text-blue-600 mx-auto text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We build local networks that help neighbors support each other’s businesses.
              </p>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="bg-blue-50 py-16 px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Meet the Team</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {[

              { name: "CMU", role: "Founder", img: "https://i.pravatar.cc/150?img=2" },
              
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition w-64"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="text-center py-16 px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Create an account today and find the perfect professional for your next project.
          </p>
          <button
            onClick={() => window.location.href = "/signup"}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition"
          >
            Sign Up Now
          </button>
        </section>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
