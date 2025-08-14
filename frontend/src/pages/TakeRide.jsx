import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TakeRide = () => {

  const URI = 'https://rideshare-backend-0tag.onrender.com'

  const [currentUser,setCurrentUser] = useState()

  const navigate = useNavigate();

  const [rides,setRides] = useState([]);

  const [filteredRides,setFilteredRides] = useState([]);

  const [source,setSource] = useState('')
  const [destination,setDestination] = useState('')

  //getting the current user name
  //manual way to decode jwt because jwt-decode is not working.
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


  //filtering the rides based on the user input(source,destination)
  const handleSearch = (e)=>{
    e.preventDefault()

    const lowerSource = source.toLowerCase()
    const lowerDestination = destination.toLowerCase()

    const result = rides.filter((ride)=>{
      return (ride.source.toLowerCase().includes(lowerSource) || lowerSource === '') && 
            (ride.destination.toLowerCase().includes(lowerDestination) || lowerDestination === '')
    })

    setFilteredRides(result)

  }

  const fetchRides = async()=>{
    try {
      const newdata = await axios.get(`${URI}/api/ride/allrides`)
      if(!newdata.data.success){
        console.log(newdata.data.message)
      }
      setRides(newdata.data.message)
      setFilteredRides(newdata.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const handleBookNow = (id)=>{
    navigate(`/takeride/${id}`)
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
      alert("Please enter both source and destination to get directions.");
    }
  }

  useEffect(()=>{
    fetchRides()
    const token = localStorage.getItem('token');
    const decoded = decodeJWT(token);

    if (decoded) {
      console.log("User email:", decoded.email); // if email is stored in token
      setCurrentUser(decoded.email)
    } else {
      console.warn("Failed to decode token");
    }
  },[])

  return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar for Take a Ride Page */}
            <nav className="bg-white shadow-md w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300 hover:cursor-pointer"
                        onClick={()=>navigate('/')} >RideShare</a>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                    onClick={()=>navigate('/')}>Back to Home</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 pt-12">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">Find Your Ride</h1>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-10 space-y-4 md:space-y-0 md:flex md:gap-4 items-center">
                    <div className="flex-1">
                        <label htmlFor="sourceFilter" className="sr-only">Source</label>
                        <input
                            type="text"
                            id="sourceFilter"
                            value={source}
                            onChange={(e) => {setSource(e.target.value)}}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Search by Source"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="destinationFilter" className="sr-only">Destination</label>
                        <input
                            type="text"
                            id="destinationFilter"
                            value={destination}
                            onChange={(e) => {setDestination(e.target.value)}}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Search by Destination"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Search
                    </button>
                </form>


                {/* Available Rides List */}
                {filteredRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRides.map((ride) => {
                            return (
                                <>
                                    { currentUser != ride.email && <div key={ride._id} className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {ride.source.toUpperCase()} <span className="text-blue-500 mx-1">→</span> {ride.destination.toUpperCase()}
                                        </h3>
                                        <p className="text-gray-700"><strong className="font-semibold">Date:</strong> {ride.date}</p>
                                        <p className="text-gray-700"><strong className="font-semibold">Time:</strong> {ride.time}</p>
                                        <p className="text-gray-700"><strong className="font-semibold">Price per Seat:</strong> ₹{ride.pricePerSeat}</p>
                                        <p className="text-gray-700"><strong className="font-semibold">Vehicle Type:</strong> {ride.vehicleType}</p>
                                        <p className="text-gray-700"><strong className="font-semibold">Available Seats:</strong> {ride.availableSeats}</p>
                                        <p className="text-gray-700"><strong className="font-semibold">Contact:</strong> {ride.contactNumber}</p>
                                        <p className='underline text-blue-600 hover:cursor-pointer mb-2' onClick={()=>handleMaps(ride.source,ride.destination)} >View it in Google Maps</p>
                                        {/* Removed email for display as per common UI pattern for ride listings, but kept in data */}
                                        <button
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" onClick={()=>handleBookNow(ride._id)}
                                        >
                                            Book Now
                                        </button>
                                    </div>}
                                </>
                            )
                        })}
                    </div>
                ) : (
                    // Display message when no rides are found after filtering
                    <p className="text-center text-gray-600 text-lg">No available rides to display.</p>
                )}
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

export default TakeRide
