import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const OfferRide = () => {

  const navigate = useNavigate();

  const [currentUser,setCurrentUser] = useState()

  const URI = 'https://rideshare-backend-0tag.onrender.com'
  //to get current user email
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = decodeJWT(token);

    if (decoded) {
      console.log("User email:", decoded.email); // if email is stored in token
      setOfferRideData(prev => ({...prev,email:decoded.email}))
      setCurrentUser(decoded.email)
    } else {
      console.warn("Failed to decode token");
    }

  }, []);


  //to store the offer ride details
  const [offerRideData,setOfferRideData] = useState({
    email:'',
    source:'',
    destination:'',
    date:'',
    time:'',
    pricePerSeat:0,
    vehicleType:'',
    availableSeats:0,
    contactNumber:''
  });

  const [message,setMessage] = useState('')

  const handleInput = (e)=>{
    const field = e.target.name
    const value = e.target.value
    setOfferRideData(prev => ({...prev,[field]:value}))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    console.log(offerRideData)
    try {

      const newdata = await axios.post(`${URI}/api/ride/postride`,offerRideData)
      const ride = {
        email:offerRideData.email,
        ride_id:newdata.data.message._id
      }
      console.log('ride:',ride)
      const newprofile = await axios.patch(`${URI}/api/profile/updateofferride/${currentUser}`,
        {ride:{
            email:offerRideData.email,
            ride_id:newdata.data.message._id
        }})

      if(!newdata.data.success){
        console.log(newdata.data.message)
      }
      console.log(newdata.data.message)
      console.log(newprofile.data.message)
      //the message appear for 2 secs
      setMessage('Offering a ride...')
      setTimeout(() => {
        setMessage('')
        //the offerRideData has to be empty
        setOfferRideData({
            source:'',
            destination:'',
            date:'',
            time:'',
            pricePerSeat:'',
            vehicleType:'',
            availableSeats:0,
            contactNumber:''
        })
      }, 2000)
    } catch (error) {
      console.log(error)
    }

  }

  return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar for Offer a Ride Page */}
            <nav className="bg-white shadow-md w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300 hover:cursor-pointer"
                        onClick={()=>navigate('/')} >RideShare</a>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                    onClick={()=>navigate('/')}>Back to Home</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">Offer a Ride</h1>

                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <p className="text-lg text-gray-700 mb-8 text-center">Fill in the details for the ride you want to offer.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Source Input */}
                        <div>
                            <label htmlFor="source" className="block text-left text-gray-800 font-medium mb-2">
                                Source Address
                            </label>
                            <input
                                type="text"
                                id="source"
                                name="source"
                                value={offerRideData.source}
                                onChange={(e)=>handleInput(e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="e.g., guntur"
                                required
                            />
                        </div>

                        {/* Destination Input */}
                        <div>
                            <label htmlFor="destination" className="block text-left text-gray-800 font-medium mb-2">
                                Destination Address
                            </label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                value={offerRideData.destination}
                                onChange={(e)=>handleInput(e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="e.g., vizag"
                                required
                            />
                        </div>

                        {/* Date and Time Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-left text-gray-800 font-medium mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={offerRideData.date}
                                    onChange={(e)=>handleInput(e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-left text-gray-800 font-medium mb-2">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={offerRideData.time}
                                    onChange={(e)=>handleInput(e)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price per Seat Input */}
                        <div>
                            <label htmlFor="pricePerSeat" className="block text-left text-gray-800 font-medium mb-2">
                                Price per Seat (₹)
                            </label>
                            <input
                                type="number"
                                id="pricePerSeat"
                                name="pricePerSeat"
                                value={offerRideData.pricePerSeat}
                                onChange={(e)=>handleInput(e)}
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="e.g., 150"
                                required
                            />
                        </div>

                        {/* Vehicle Type Dropdown */}
                        <div>
                            <label htmlFor="vehicleType" className="block text-left text-gray-800 font-medium mb-2">
                                Vehicle Type
                            </label>
                            <select
                                id="vehicleType"
                                name="vehicleType"
                                value={offerRideData.vehicleType}
                                onChange={(e)=>handleInput(e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white"
                                defaultValue='2-Wheeler'
                                required
                            >
                                <option value="2-wheeler">2-Wheeler</option>
                                <option value="4-wheeler">4-Wheeler</option>
                            </select>
                        </div>

                        {/* Available Seats Input */}
                        <div>
                            <label htmlFor="availableSeats" className="block text-left text-gray-800 font-medium mb-2">
                                Available Seats
                            </label>
                            <input
                                type="number"
                                id="availableSeats"
                                name="availableSeats"
                                value={offerRideData.availableSeats}
                                onChange={(e)=>handleInput(e)}
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="e.g., 3"
                                required
                            />
                        </div>

                        {/* Contact Number Input */}
                        <div>
                            <label htmlFor="contactNumber" className="block text-left text-gray-800 font-medium mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel" // Use type="tel" for phone numbers
                                id="contactNumber"
                                name="contactNumber"
                                value={offerRideData.contactNumber}
                                onChange={(e)=>handleInput(e)}
                                maxLength="10" // Assuming 10-digit Indian numbers
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="e.g., 9876543210"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`mt-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-400`}>
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                        >
                            Offer Ride
                        </button>
                    </form>
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

export default OfferRide
