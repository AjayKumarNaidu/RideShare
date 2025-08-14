import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const MyRides = () => {

  const URI = 'https://mapper-11ly.onrender.com'
  const navigate = useNavigate();

  const [currentUser,setCurrentUser] = useState()

  const [takenRides,setTakenRides] = useState([])
  const [offerRides,setOfferRides] = useState([])

  // This function now handles all status and button logic.
  const getRideState = (rideDate, rideTime, isOffered) => {
    const rideTimeInMs = new Date(`${rideDate}T${rideTime}`).getTime();
    const currentTimeInMs = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // If the ride is more than 24 hours in the past, it is completed.
    if (currentTimeInMs > rideTimeInMs + oneDayInMs) {
      return {
        statusText: 'Completed',
        statusColor: 'text-gray-500',
        buttonText: 'Completed',
        isButtonDisabled: true,
        isCompleted: true
      };
    } 
    // If the ride is scheduled within the last 24 hours, the button is enabled.
    else if (currentTimeInMs >= rideTimeInMs) {
      return {
        statusText: isOffered ? 'In Progress' : 'Live',
        statusColor: 'text-green-600',
        buttonText: isOffered ? 'Start Ride' : 'View Ride',
        isButtonDisabled: false,
        isCompleted: false
      };
    } 
    // Otherwise, the ride is in the future.
    else {
      return {
        statusText: isOffered ? 'Available' : 'Upcoming',
        statusColor: isOffered ? 'text-blue-600' : 'text-green-600',
        buttonText: isOffered ? 'Start Ride' : 'View Ride',
        isButtonDisabled: true,
        isCompleted: false
      };
    }
  };

  // Manual way to decode jwt.
  function decodeJWT(token) {
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload); // returns the payload as an object
    } catch (error) {
      console.error('Invalid JWT', error);
      return null;
    }
  }

  const fetchRides = async()=>{
    try {
        const newprofile = await axios.get(`${URI}/api/profile/oneprofile/${currentUser}`)
        const allrides = await axios.get(`${URI}/api/ride/allrides`)
        
        //filtering the taken rides
        const userTakenRides = newprofile.data.message.takeride.map((ride)=>{
            return ride.ride_id
        })
        const availableRides = allrides.data.message

        const tempTakenRides = availableRides.filter((ride)=>{
            return userTakenRides.includes(ride._id)
        })

        //filtering the offer rides
        const userOfferRides = newprofile.data.message.offerride.map((ride)=>{
            return ride.ride_id
        })

        const tempOfferRides = availableRides.filter((ride)=>{
            return userOfferRides.includes(ride._id)
        })

        console.log('curr user profile:',newprofile.data.message)
        console.log('all rides available',allrides.data.message)
        
        setTakenRides(tempTakenRides)
        setOfferRides(tempOfferRides)
    } catch (error) {
        console.log(error.message)
    }
  }

  const handleMaps = (source,destination)=>{
    if (source && destination) {
      // Construct the Google Maps URL for directions
      // 'dir/' is the path for directions
      const encodedSource = encodeURIComponent(source);
      const encodedDestination = encodeURIComponent(destination);
      const googleMapsUrl = `https://www.google.com/maps/dir/${encodedSource}/${encodedDestination}`;

      window.open(googleMapsUrl, '_blank');
    } else {
      // Replaced `alert` with a custom message box or modal in a real app.
      console.warn("Please enter both source and destination to get directions.");
    }
  }

  // Function to handle button clicks and navigate to the maps page
  const handleRideAction = (email) => {
    console.log(`Navigating to maps for ride: ${email}`);
    navigate(`/maps/${email}/${currentUser}`);
  };


  useEffect(()=>{
    const token = localStorage.getItem('token');
    const decoded = decodeJWT(token);

    if (decoded) {
      console.log("User email:", decoded.email); // if email is stored in token
      setCurrentUser(decoded.email)
    } else {
      console.warn("Failed to decode token");
    }
  },[])

  useEffect(()=>{
    if(currentUser){
        fetchRides();
    }
  },[currentUser])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar for My Rides Page */}
        <nav className="bg-white shadow-md w-full z-50 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <a onClick={()=>navigate('/')} className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300 hover:cursor-pointer">RideShare</a>
                <button onClick={()=>navigate('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">Back to Home</button>
            </div>
        </nav>

        <div className="container mx-auto px-4 py-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">My Rides</h1>

            {/* My Taken Rides Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 pb-2">Rides I've Taken</h2>
                {takenRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {takenRides.map(ride => {
                            const { statusText, statusColor, buttonText, isButtonDisabled } = getRideState(ride.date, ride.time, false);

                            return (
                                <div key={ride.contactNumber} className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {ride.source.toUpperCase()} <span className="text-blue-500 mx-1">→</span> {ride.destination.toUpperCase()}
                                    </h3>
                                    <p className="text-gray-700"><strong className="font-semibold">Date:</strong> {ride.date}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Time:</strong> {ride.time}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Price Paid:</strong> ₹{ride.pricePerSeat * ride.bookedSeats}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Seats Booked:</strong> {ride.bookedSeats}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Vehicle:</strong> {ride.vehicleType}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Driver Contact:</strong> {ride.contactNumber}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Driver Email:</strong> {ride.email}</p>
                                    <p className='underline text-blue-600 hover:cursor-pointer' onClick={()=>handleMaps(ride.source,ride.destination)}>View it in Google Maps</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <p className={`text-xl font-bold ${statusColor}`}>
                                            Status: {statusText}
                                        </p>
                                        <button
                                            onClick={() => handleRideAction(ride.email)}
                                            disabled={isButtonDisabled}
                                            className={`py-2 px-4 rounded-lg shadow-md transition duration-300 ${!isButtonDisabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">You haven't taken any rides yet.</p>
                )}
            </div>

            {/* My Offered Rides Section */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 pb-2">Rides I've Offered</h2>
                {offerRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offerRides.map(ride => {
                            const { statusText, statusColor, buttonText, isButtonDisabled } = getRideState(ride.date, ride.time, true);

                            return (
                                <div key={ride.contactNumber} className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {ride.source.toUpperCase()} <span className="text-indigo-500 mx-1">→</span> {ride.destination.toUpperCase()}
                                    </h3>
                                    <p className="text-gray-700"><strong className="font-semibold">Date:</strong> {ride.date}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Time:</strong> {ride.time}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Price per Seat:</strong> ₹{ride.pricePerSeat}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Vehicle:</strong> {ride.vehicleType}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Seats Offered:</strong> {ride.availableSeats}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Seats Booked:</strong> {ride.seatsBooked}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Your Contact:</strong> {ride.contactNumber}</p>
                                    <p className="text-gray-700"><strong className="font-semibold">Your Email:</strong> {ride.email}</p>
                                    <p className='underline text-blue-600 hover:cursor-pointer' onClick={()=>handleMaps(ride.source,ride.destination)} >View it in Google Maps</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <p className={`text-xl font-bold ${statusColor}`}>
                                            Status: {statusText}
                                        </p>
                                        <button
                                            onClick={() => handleRideAction(ride.email)}
                                            disabled={isButtonDisabled}
                                            className={`py-2 px-4 rounded-lg shadow-md transition duration-300 ${!isButtonDisabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">You haven't offered any rides yet.</p>
                )}
            </div>
        </div>

        {/* Footer - Consistent with other pages */}
        <footer className="bg-gray-900 text-white py-10 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-lg mb-4">&copy; 2025 RideShare Connect. All rights reserved.</p>
                <div className="flex justify-center space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    </div>
  );
}

export default MyRides
