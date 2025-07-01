import React, { useEffect, useState, useRef } from "react";

const SearchBar = ({ serviceValue, onServiceChange }) => {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const autocompleteService = useRef(null);

  // Reverse-geocode to detect user’s city
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.address && (data.address.city || data.address.town || data.address.village)) {
          setCity(data.address.city || data.address.town || data.address.village);
        }
      });
    }
  }, []);

  // Load Google Places API for city autocomplete
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBDW-UQqj8JSJs7AyqR6oTsV1a_xznSTR0&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      };
      document.body.appendChild(script);
    } else {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const fetchCitySuggestions = (value) => {
    if (!autocompleteService.current || !value) return;
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ["(cities)"],
        componentRestrictions: { country: ["us", "ca", "mx"] },
      },
      (predictions, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          setCitySuggestions([]);
          return;
        }
        setCitySuggestions(predictions.map((p) => p.description));
      }
    );
  };

  return (
    <div className="mt-6 flex justify-center relative">
      {/* Controlled service-name input */}
      <input
        type="text"
        placeholder="What service do you need?"
        value={serviceValue}
        onChange={(e) => onServiceChange(e.target.value)}
        className="border border-gray-300 rounded-l px-4 py-2 w-1/3 mr-2"
      />

      {/* City input + suggestions */}
      <input
        type="text"
        placeholder="Your City"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          fetchCitySuggestions(e.target.value);
        }}
        className="border border-gray-300 px-4 py-2 w-1/5"
        autoComplete="off"
      />
      {citySuggestions.length > 0 && (
        <div className="absolute bg-white border rounded shadow max-h-40 overflow-y-auto left-[calc(33%+8px)] top-12 w-1/5 z-10">
          {citySuggestions.map((s, i) => (
            <div
              key={i}
              className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                const cityName = s.split(",")[0];
                setCity(cityName);
                setCitySuggestions([]);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      <button className="bg-blue-600 text-white px-6 py-2 rounded-r">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
