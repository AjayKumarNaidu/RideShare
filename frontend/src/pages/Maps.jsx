import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// This is a standalone component for the Maps page.
// It displays an embedded map and a "Ride Completed" button for passengers.
function Maps() {
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueId, setUniqueId] = useState('your-unique-id-here');
  const mapperUrl = 'https://mapper-1-by95.onrender.com/';

  const navigate = useNavigate();
  const { email, currentUser } = useParams();

  const handleBackToHome = () => {
    // This is a simple way to navigate back to the home page.
    window.location.href = '/';
  };

  const handleRideCompleted = () => {
    // This function handles the "Ride Completed" action and navigates to the home page.
    // You can add your backend logic here to update the ride status if needed.
    navigate('/');
  };

  useEffect(() => {
    setUniqueId(email);
    console.log(email, currentUser);
  }, [email, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar for the Ride Mapper Page */}
      <nav className="bg-white shadow-md w-full z-50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Title on the left */}
          <span className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:cursor-pointer" onClick={handleBackToHome}>
            RideShare
          </span>
          
          {/* Back to MyRides button on the right */}
          <button
            onClick={() => navigate('/myrides')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Back to MyRides
          </button>
        </div>
      </nav>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8 pt-8 flex-grow">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
          Ride Mapper
        </h1>
        
        {/* Updated instructional text with unique ID state and conditional button */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <p className="text-center text-lg text-gray-600 px-4">
            Select the role and enter the unique id: <strong className="text-blue-600">{uniqueId}</strong>
          </p>
          {email !== currentUser && (
            <button
              onClick={handleRideCompleted}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            >
              Ride Completed
            </button>
          )}
        </div>

        {/* This section contains the embedded mapper */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-12 h-[85vh] flex flex-col overflow-hidden relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            View Live Map
          </h2>
          
          {/* Conditional rendering for the loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Iframe to embed the external mapper application with the static URL */}
          {/* The onLoad event handler sets isLoading to false once the iframe content has loaded. */}
          <iframe
            src={mapperUrl}
            title="Live Ride Mapper"
            className={`w-full h-full border-0 rounded-lg ${isLoading ? 'hidden' : ''}`}
            allow="geolocation"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </div>

      {/* Footer - Consistent with other pages */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">
            &copy; 2025 RideShare Connect. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Maps;
