import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import emailjs from '@emailjs/browser'

const Register = () => {

  const URI = 'http://localhost:5000'
  
  //navigation to use routes
  const navigate = useNavigate()

  //to store the user info
  const [data,setData] = useState({
    name:'',
    email:'',
    password:''
  });

  const handleInput = (e)=>{
    const field = e.target.name
    const value = e.target.value
    setData(prev => ({...prev,[field]:value}))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const newdata = await axios.post(`${URI}/api/auth/register`,data)
      const newprofile = await axios.post(`${URI}/api/profile/initialprofile`, { name: data.name, email: data.email })
      window.alert('Registered succesfully')

      //sending email
      emailjs.send('service_zwsxlim', 'template_vxfm4r6', {
            name: data.name,
            email: data.email
      }, 'xsNydZf23k21qjoEW');
      console.log('mail sent :)')

      setData({
        name:'',
        email:'',
        password:''
      })

      console.log(newdata.data)
      console.log(newprofile.data)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="register" className="py-16 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Register</h2>
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-left text-gray-800 font-medium mb-2">Name</label>
                        <input type="text" id="name" name="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" placeholder="Your Name" value={data.name} onChange={(e)=>handleInput(e)}/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-left text-gray-800 font-medium mb-2">Email</label>
                        <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" placeholder="xyz@email.com" value={data.email} onChange={(e)=>handleInput(e)}/>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-left text-gray-800 font-medium mb-2">Password</label>
                        <input type='password' id='message'name='password' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300' value={data.password} placeholder='password' onChange={(e)=>handleInput(e)}/>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">Register</button>
                    <p className=''>Already have an account.<span className='text-blue-700 cursor-pointer' onClick={()=>navigate('/login')}>Login here</span></p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Register
