import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {

  const URI = 'https://rideshare-backend-0tag.onrender.com'

  const navigate = useNavigate()

  const [allUsers,setAllUsers] = useState([])

  const fetchUsers = async()=>{
    try {
      const allprofiles = await axios.get(`${URI}/api/profile/allprofiles`)
      console.log(allprofiles.data.message)
      setAllUsers(allprofiles.data.message)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Navbar for All Users Page */}
            <nav className="bg-white shadow-md w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a onClick={()=>navigate('/')} className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300 hover:cursor-pointer">RideShare</a>
                    <button onClick={()=>navigate('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">Back to Home</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 pt-12">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">All Users</h1>

                {allUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {allUsers.map((user) => {
                          const handleUserClick = (e)=>{
                            navigate(`/userprofile/${user.email}`)
                          }
                        return (
                            <div key={user.id} onClick={handleUserClick} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:cursor-pointer">
                                {/* User's first letter as a rounded profile icon */}
                                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</h3>
                                <p className="text-gray-700">{user.email}</p>
                            </div>
                        )}
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No users to display.</p>
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

export default AllUsers
