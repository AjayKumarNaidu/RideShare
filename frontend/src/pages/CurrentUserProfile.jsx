import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CurrentUserProfile = () => {

  const navigate = useNavigate();

  const URI = 'http://localhost:5000'

  //profile user info
  const [user,setUser] = useState({
    name: '',
    email: '',
    takeride: [],
    offerride: [],
    ratings: [], // Example ratings out of five
    reviews: []
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

  const fetchProfile = async()=>{
    try {
      const newprofile = await axios.get(`${URI}/api/profile/oneprofile/${currentUser}`)
      console.log(newprofile.data.message)
      setUser(newprofile.data.message)
    } catch (error) {
      console.log(error.message)
    }
  }

  //currentuser
  const [currentUser,setCurrentUser] = useState('')

  //state for newReview
  const [newReview,setNewReview] = useState('')

  //state for reviewMessage
  const [reviewMessage,setReviewMessage] = useState('')

  //average rating
  const averageRating = user.ratings.length > 0 ? user.ratings.reduce((acc,curr)=>acc+parseInt(curr),0)/user.ratings.length : '-'

  // Extract first letter for profile icon
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleReviewSubmit = async (e)=>{
    e.preventDefault()
    if(newReview.length === 0){
        setReviewMessage('Error : Enter Something to Post')
        return
    }
    try {
        const newreview = await axios.post(`${URI}/api/review/postreview`,{name:user.name,review:newReview})
        console.log(newreview.data.message)
        setReviewMessage('Thank you. Review is successfully Posted')
        setNewReview('')
    } catch (error) {
        console.log(error)
    }
    setTimeout(() => {
        setReviewMessage('')
    }, 2000);
  }

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
      fetchProfile()
    }
  },[currentUser])

  return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Navbar for Profile Page */}
            <nav className="bg-white shadow-md w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a onClick={()=>navigate('/')} className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300 hover:cursor-pointer">RideShare</a>
                    <button onClick={()=>navigate('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">Back to Home</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 pt-12">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">My Profile</h1>

                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
                    {/* User Profile Section */}
                    <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-gray-200">
                        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-md">
                            {firstLetter}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</h2>
                        <p className="text-lg text-gray-600">{user.email}</p>
                    </div>

                    {/* Ride Statistics and Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center pb-8 border-b border-gray-200">
                        <div>
                            <p className="text-5xl font-extrabold text-blue-600">{user.takeride.length}</p>
                            <p className="text-lg text-gray-700">Rides Taken</p>
                        </div>
                        <div>
                            <p className="text-5xl font-extrabold text-indigo-600">{user.offerride.length}</p>
                            <p className="text-lg text-gray-700">Rides Offered</p>
                        </div>
                        <div>
                            <p className="text-5xl font-extrabold text-green-600">{ averageRating !== '-' ? Math.round(averageRating*100)/100 : averageRating}</p>
                            <p className="text-lg text-gray-700">Average Rating (out of 5)</p>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">My Customer Reviews</h3>
                        {user.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {user.reviews.map((review, index) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-700 italic">"{review}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No reviews available yet.</p>
                        )}
                    </div>

                    {/* Submit Review Form */}
                    <div className="pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review for the App</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="appReview" className="sr-only">Your Review</label>
                                <textarea
                                    id="appReview"
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    placeholder="Share your thoughts about the app..."
                                ></textarea>
                            </div>
                            {reviewMessage && (
                                <div className={`p-3 rounded-lg ${reviewMessage.includes('Error') ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                                    {reviewMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                onClick={handleReviewSubmit}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
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

export default CurrentUserProfile
