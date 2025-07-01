import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="ServiceHub Logo" className="h-6" />
          <h1 className="text-2xl font-bold">ServiceHub</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            {(user && user.role == "customer") && (<li><a href="/home" className="hover:underline">Home</a></li>)}
            {(user && user.role == "customer") && (<li><a href="/mybookings" className="hover:underline">My Bookings</a></li>)}
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </nav>
        {user ? (
          <button
            className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center border border-gray-300 hover:ring-2 hover:ring-blue-400"
            onClick={() => navigate('/profilePage')}
            title="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" width="28" height="28">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
            </svg>
          </button>
        ) : (
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
