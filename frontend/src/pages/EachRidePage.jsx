import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EachRidePage = () => {

  const URI = 'https://mapper-11ly.onrender.com'

  const navigate = useNavigate();

  const [currentUser,setCurrentUser] = useState();

  const [rideDetails,setRideDetails] = useState({
    id: '',
    email: '',
    source: '',
    destination: '',
    date: '',
    time: '',
    pricePerSeat: 0, // Numeric value for calculation
    vehicleType: '',
    availableSeats: 0, // Number of seats available for this dummy ride
    bookedSeats:0,
    contactNumber: ''
  })

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

  const {id} = useParams()

  const [numberOfSeats,setNumberOfSeats] = useState(1)

  const [totalPrice,setTotalPrice] = useState(0)

  const [showPaymentForm,setShowPaymentForm] = useState(false)

  const [isProcessingPayment,setIsProcessingPayment] = useState(false)

  //card details
  const [cardNumber,setCardNumber] = useState('')

  const [expiryDate,setExpiryDate] = useState('')

  const [cvc,setCvc] = useState('')

  //booking message
  const [bookingMessage,setBookingMessage] = useState()

  const handleProceedToPayment = ()=>{
    setShowPaymentForm(true)
  }

  const handlePayment = async()=>{
    
    const isSuccess = Math.random() > 0.1

    if(isSuccess){
      if(cardNumber.length < 10 || expiryDate.length < 5 || cvc.length < 3){
        setBookingMessage('Error : Please enter your credentials correctly')
        return
      }
      setTimeout(async ()=>{
        setBookingMessage('Ticket Booked Successfully')
        try {
            const availableSeats = rideDetails.availableSeats - numberOfSeats;
            const bookedSeats = rideDetails.bookedSeats + numberOfSeats;

            const newride = await axios.patch(`${URI}/api/ride/updateride/${id}`,{availableSeats:availableSeats,email:currentUser,bookedSeats:bookedSeats})
            const newprofile = await axios.patch(`${URI}/api/profile/updatetakenride/${currentUser}`,
                {ride:{email:rideDetails.email,ride_id:newride.data.message._id}})

            console.log(newride.data.message)
            console.log(newprofile.data.message)
        } catch (error) {
            console.log(error.message)
        }
        setIsProcessingPayment(false)
      },2000)
      setBookingMessage('Processing...')
      setIsProcessingPayment(true)
    }
  }

  const fetchride = async()=>{
    try {
        const newride = await axios.get(`${URI}/api/ride/oneride/${id}`)
        setRideDetails(newride.data.message)
    } catch (error) {
        console.log(error.message)
    }
  }

  const handleEmail = (e)=>{
    e.preventDefault()
    console.log(rideDetails.email)
    navigate(`/userprofile/${rideDetails.email}`)
  }


  useEffect(()=>{
    setTotalPrice(numberOfSeats*rideDetails.pricePerSeat)
  },[rideDetails])

  useEffect(()=>{
    fetchride()

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
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Navbar */}
            <nav className="bg-white shadow-md w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a href="#" onClick={() => navigate('/')} className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300">RideShare</a>
                    <button onClick={() => navigate('/takeride')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">Back to Rides</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 pt-12">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">Confirm Your Ride</h1>

                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Ride Details</h2>
                    <div className="space-y-4 text-lg text-gray-700 mb-8">
                        <p><strong className="font-semibold">From:</strong> {rideDetails.source.toUpperCase()}</p>
                        <p><strong className="font-semibold">To:</strong> {rideDetails.destination.toUpperCase()}</p>
                        <p><strong className="font-semibold">Date:</strong> {rideDetails.date}</p>
                        <p><strong className="font-semibold">Time:</strong> {rideDetails.time}</p>
                        <p><strong className="font-semibold">Price per Seat:</strong> ₹{rideDetails.pricePerSeat}</p>
                        <p><strong className="font-semibold">Vehicle Type:</strong> {rideDetails.vehicleType}</p>
                        <p><strong className="font-semibold">Available Seats:</strong> {rideDetails.availableSeats}</p>
                        <p><strong className="font-semibold">Contact Driver:</strong> {rideDetails.contactNumber}</p>
                        <div className='space-y-0 mt-2'>
                            <p className='text-xs text-red-500'>click on the email below to visit the driver's profile.</p>
                            <p className='hover:cursor-pointer underline' onClick={handleEmail}><strong className="font-semibold">Driver Email:</strong> {rideDetails.email}</p> {/* Displaying driver email */}
                        </div>
                        
                    </div>

                    {!showPaymentForm ? (
                        <>
                            <div className="mt-8">
                                <label htmlFor="numSeats" className="block text-left text-gray-800 font-medium mb-2 text-xl">
                                    Number of Seats:
                                </label>
                                <input
                                    type="number"
                                    id="numSeats"
                                    value={numberOfSeats}
                                    onChange={(e) => {
                                        // Ensure the value is a number, default to 1 if empty or invalid
                                        const value = parseInt(e.target.value);
                                        setNumberOfSeats(Math.max(1, Math.min(value, rideDetails.availableSeats)));
                                    }}
                                    min={1}
                                    max={rideDetails.availableSeats}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-center text-xl"
                                />
                            </div>

                            <p className="text-2xl font-bold text-gray-900 mt-6 text-center">
                                Total Amount: ₹{totalPrice*numberOfSeats}
                            </p>

                            <button
                                onClick={handleProceedToPayment}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 mt-8"
                                disabled={rideDetails.availableSeats === 0} // Disable if no seats
                            >
                                {rideDetails.availableSeats === 0 ? 'No Seats Available' : 'Proceed to Payment'}
                            </button>
                        </>
                    ) : (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Payment Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-left text-gray-800 font-medium mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="XXXX XXXX XXXX XXXX (e.g., 1111 2222 3333 4444)"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        maxLength="16"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-left text-gray-800 font-medium mb-2">Expiry Date (MM/YY)</label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            placeholder="MM/YY (e.g., 12/25)"
                                            value={expiryDate}
                                            onChange={(e) => {
                                                setExpiryDate(e.target.value.substring(0, 5));
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cvc" className="block text-left text-gray-800 font-medium mb-2">CVC</label>
                                        <input
                                            type="text"
                                            id="cvc"
                                            placeholder="CVC (e.g., 123)"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                            maxLength="4"
                                        />
                                    </div>
                                </div>
                            </div>
                            {bookingMessage && (
                                <div className={`mt-6 p-4 rounded-lg ${bookingMessage.includes('Error') || bookingMessage.includes('Processing') ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                                    {bookingMessage}
                                </div>
                            )}
                            <button
                                onClick={handlePayment}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 mt-8"
                                disabled={isProcessingPayment}
                            >
                                { rideDetails.availableSeats == 0 ? 'No Seats Available' : isProcessingPayment ? 'Processing...' : `Pay ₹${totalPrice}`}
                            </button>
                        </div>
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

export default EachRidePage
