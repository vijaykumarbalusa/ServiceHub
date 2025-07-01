import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("customer");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [zipSuggestions, setZipSuggestions] = useState([]);
  const navigate = useNavigate();
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBDW-UQqj8JSJs7AyqR6oTsV1a_xznSTR0&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          document.createElement("div"),
        );
      };
      document.body.appendChild(script);
    } else {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );
    }
  }, []);

  const fetchGoogleSuggestions = (type, value) => {
    if (!autocompleteService.current || !value) return;
    let options = {
      input: value,
      componentRestrictions: { country: ["us", "ca", "mx"] },
    };
    if (type === "zip") {
      options.types = ["(regions)"];
    } else if (type === "state") {
      options.types = ["(regions)"];
    } else if (type === "city") {
      options.types = ["(cities)"];
    } else {
      options.types = ["address"];
    }
    autocompleteService.current.getPlacePredictions(
      options,
      (predictions, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          if (type === "address") setAddressSuggestions([]);
          if (type === "city") setCitySuggestions([]);
          if (type === "state") setStateSuggestions([]);
          if (type === "zip") setZipSuggestions([]);
          return;
        }
        const suggestions = predictions.map((p) => ({
          description: p.description,
          place_id: p.place_id,
        }));
        if (type === "address") setAddressSuggestions(suggestions);
        if (type === "city") setCitySuggestions(suggestions);
        if (type === "state") setStateSuggestions(suggestions);
        if (type === "zip") setZipSuggestions(suggestions);
      },
    );
  };

  const handleAddressSelect = (suggestion) => {
    setAddress(suggestion.description);
    setAddressSuggestions([]);
    // Fetch place details to auto-fill city, state, zip
    if (placesService.current && suggestion.place_id) {
      placesService.current.getDetails(
        { placeId: suggestion.place_id },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            let cityVal = "";
            let stateVal = "";
            let zipVal = "";
            place.address_components.forEach((comp) => {
              if (comp.types.includes("locality")) cityVal = comp.long_name;
              if (comp.types.includes("administrative_area_level_1"))
                stateVal = comp.long_name;
              if (comp.types.includes("postal_code")) zipVal = comp.long_name;
            });
            setCity(cityVal);
            setState(stateVal);
            setZipCode(zipVal);
          }
        },
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/servicehub/login",
        {
          email,
          password,
        },
      );

      if(response.data.message === "Invalid credentials"){
        return alert("Invalid credentials");
      }

      if(response.data.message === "User not found"){
        return alert("User not found");
      }

      if (response.data && response.data.role) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.role === "customer") {
          navigate("/home");
        } else if (response.data.role === "provider") {
          navigate("/providerDashboard");
        } else if (response.data.role === "admin") {
          navigate("/adminDashboard");
        } else {
          alert("Unknown user role.");
        }
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      alert("Internal server error", error);
      console.log("error", error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        address,
        phone_number: phoneNumber,
        city,
        state,
        zip_code: zipCode,
        is_active: true
      };
      if (role === "provider") {
        payload = {
          ...payload,
          company_name: companyName,
          description,
          is_active: true
        };
      }
      console.log("payload", payload)
      const response = await axios.post(
        "http://127.0.0.1:5000/servicehub/register",
        payload,
      );
      if (response.status === 201) {
        alert("Sign-up successful! Please log in.");
        setIsSignUp(false);
        navigate("/login");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 animate-blueBackground">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {isSignUp ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Service Provider</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    fetchGoogleSuggestions("address", e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
                {addressSuggestions.length > 0 && (
                  <div className="bg-white border rounded shadow max-h-40 overflow-y-auto">
                    {addressSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleAddressSelect(s)}
                      >
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    fetchGoogleSuggestions("city", e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
                {citySuggestions.length > 0 && (
                  <div className="bg-white border rounded shadow max-h-40 overflow-y-auto">
                    {citySuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setCity(s.description);
                          setCitySuggestions([]);
                        }}
                      >
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    fetchGoogleSuggestions("state", e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
                {stateSuggestions.length > 0 && (
                  <div className="bg-white border rounded shadow max-h-40 overflow-y-auto">
                    {stateSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setState(s.description);
                          setStateSuggestions([]);
                        }}
                      >
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Zip Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    fetchGoogleSuggestions("zip", e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
                {zipSuggestions.length > 0 && (
                  <div className="bg-white border rounded shadow max-h-40 overflow-y-auto">
                    {zipSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setZipCode(s.description);
                          setZipSuggestions([]);
                        }}
                      >
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {role === "provider" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  navigate("/login");
                }}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Do not have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
