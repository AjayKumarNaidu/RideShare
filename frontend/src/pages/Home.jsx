import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const Home = () => {

    const URI = 'https://rideshare-backend-0tag.onrender.com'

    //navigate
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Effect for smooth scrolling when a navigation link is clicked
    useEffect(() => {
        const handleNavLinkClick = (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        };

        // Attach click listeners to all navigation links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Clean up event listeners on component unmount
        return () => {
            navLinks.forEach(link => {
                link.removeEventListener('click', handleNavLinkClick);
            });
        };
    }, []); // Empty dependency array means this runs once on mount

    // Dummy function for "Take a Ride" in this standalone file
    const handleTakeRideClick = (e) => {
        e.preventDefault();
        navigate('/takeride')
    };

    // Dummy function for "Offer a Ride" in this standalone file
    const handleOfferRideClick = (e) => {
        e.preventDefault()
        navigate('/offerride')
    };

    const handleMyRides = (e) => {
        navigate('/myrides')
    }

    const handleAllUsers = () => {
        navigate('/allusers')
    }

    const handleLogout = () => {
        // Remove auth token
        localStorage.removeItem('token');

        // Optional: clear any auth-related state
        // setUser(null); // if you have user state

        // Force menu close if on mobile
        setIsMenuOpen(false);

        // Navigate to login page
        navigate('/login');
    };

    const [contactData, setContactData] = useState({
        name: '',
        sender_email: '',
        message: ''
    })

    const [allCustomerReviews, setAllCustomerReviews] = useState([])

    // State to store randomly selected reviews
    const [displayedReviews, setDisplayedReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const newreviews = await axios.get(`${URI}/api/review/allreviews`)
            console.log(newreviews.data.message)
            setAllCustomerReviews(newreviews.data.message)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (contactData.name.length === 0 || contactData.sender_email.length === 0 || contactData.message.length === 0) {
            alert('All fields are required!!')
            return
        }

        emailjs.send('service_zwsxlim', 'template_99fsilz', {
            name: contactData.name,
            message: contactData.message,
            sender_email: contactData.sender_email
        }, 'xsNydZf23k21qjoEW');

        setContactData({
            name: '',
            sender_email: '',
            message: ''
        })
        console.log('email sent :)')
    }

    const handleMobileLogout = () => {
        console.log('Logging out from mobile...');
        window.alert('logged out');
        handleLogout();
        setIsMenuOpen(false);
    };

    useEffect(() => {
        fetchReviews()
    }, [])

    // Effect to select random reviews on component mount
    useEffect(() => {
        const selectRandomReviews = () => {
            const shuffled = [...allCustomerReviews].sort(() => 0.5 - Math.random());
            setDisplayedReviews(shuffled.slice(0, 3)); // Pick the first 3 after shuffling
        };
        selectRandomReviews();
    }, [allCustomerReviews]); // Run only once on mount

    return (
        <div className="bg-gray-50 text-gray-800">
            {/* Navbar */}
            <nav className="bg-white shadow-md fixed w-full z-50 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a href="#home" className="text-2xl font-bold text-gray-900 rounded-lg p-2 hover:bg-gray-100 transition duration-300">RideShare</a>
                    
                    {/* Menu button for mobile */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Desktop navigation links */}
                    <div className="hidden md:flex flex-wrap justify-center space-x-2 sm:space-x-4">
                        <a href="#home" className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 `}>Home</a>
                        <a href="#how-it-works" className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 `}>How It Works</a>
                        <a href="#reviews" className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 `}>Customer Reviews</a>
                        <a href="#contact" className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 `}>Contact</a>
                        <button onClick={handleAllUsers} className="text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100">All Users</button>
                        <button onClick={handleMyRides} className="text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100">My Rides</button>
                    </div>
                    <div className='hidden md:flex space-x-2'>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300" onClick={() => navigate('/currentuserprofile')}>Profile</button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                
                {/* Mobile drawer */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
                    <div className="flex flex-col items-center space-y-2">
                        <a href="#home" onClick={() => setIsMenuOpen(false)} className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center `}>Home</a>
                        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center `}>How It Works</a>
                        <a href="#reviews" onClick={() => setIsMenuOpen(false)} className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center `}>Customer Reviews</a>
                        <a href="#contact" onClick={() => setIsMenuOpen(false)} className={`nav-link text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center `}>Contact</a>
                        <button onClick={() => { handleAllUsers(); setIsMenuOpen(false); }} className="text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center">All Users</button>
                        <button onClick={() => { handleMyRides(); setIsMenuOpen(false); }} className="text-lg text-gray-700 hover:text-blue-600 transition duration-300 rounded-lg p-2 hover:bg-gray-100 w-full text-center">My Rides</button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 w-full text-center" onClick={() => { navigate('/currentuserprofile'); setIsMenuOpen(false); }}>Profile</button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 w-full text-center" onClick={handleMobileLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            {/* Home Section */}
            <section id="home" className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center pt-20">
                <div className="container mx-auto px-4 py-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">Your Journey, Your Way.</h1>
                    <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">Connect with fellow travelers and share rides effortlessly. Affordable, convenient, and eco-friendly.</p>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                        <a href="#" onClick={handleTakeRideClick} className="block bg-white text-blue-600 py-5 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out transform flex-1 max-w-xs md:max-w-sm border-b-4 border-blue-700">
                            <h2 className="text-3xl font-bold mb-3">🚗 Take a Ride</h2>
                            <p className="text-lg text-gray-700">Find a ride that fits your schedule and budget. Travel smart.</p>
                        </a>
                        <a href="#" onClick={handleOfferRideClick} className="block bg-white text-indigo-600 py-5 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out transform flex-1 max-w-xs md:max-w-sm border-b-4 border-indigo-700">
                            <h2 className="text-3xl font-bold mb-3">🤝 Offer a Ride</h2>
                            <p className="text-lg text-gray-700">Share your journey, reduce costs, and help others get there.</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition duration-300">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-6">1</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Search/Post Your Ride</h3>
                            <p className="text-gray-600 leading-relaxed">Easily search for available rides based on your destination or post your vehicle's empty seats for others to book.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition duration-300">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-6">2</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Connect & Confirm</h3>
                            <p className="text-gray-600 leading-relaxed">Connect directly with drivers or passengers. Confirm details, share location, and get ready to go.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition duration-300">
                            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-6">3</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Enjoy Your Journey</h3>
                            <p className="text-gray-600 leading-relaxed">Enjoy a comfortable, affordable, and eco-friendly ride. Rate your experience to help our community grow.</p>
                        </div>
                    </div>
                    <div className="mt-16">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose RideShare Connect?</h3>
                        <ul className="text-lg text-gray-700 space-y-4 max-w-3xl mx-auto">
                            <li className="flex items-center justify-center"><svg className="w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Cost-Effective: Save money on fuel and tolls by sharing rides.</li>
                            <li className="flex items-center justify-center"><svg className="w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Environmentally Friendly: Reduce your carbon footprint by carpooling.</li>
                            <li className="flex items-center justify-center"><svg className="w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Community Driven: Build connections with people in your area.</li>
                            <li className="flex items-center justify-center"><svg className="w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Flexible & Convenient: Find or offer rides that match your schedule.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section id="reviews" className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12">What Our Users Say</h2>
                    {displayedReviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedReviews.map((reviewData, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl shadow-lg p-8 text-left transform hover:scale-105 transition duration-300 flex flex-col justify-between">
                                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{reviewData.review}"</p>
                                    <div className="flex items-center">
                                        {/* Replaced img with div for first letter */}
                                        <div className="w-14 h-14 rounded-full mr-4 object-cover bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                            {reviewData.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{reviewData.name.charAt(0).toUpperCase() + reviewData.name.slice(1)}</p>
                                            {/* You can add a role here if your dummy data includes it */}
                                            {/* <p className="text-sm text-gray-600">Daily Commuter</p> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 text-lg">No reviews to display.</p>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12">Get in Touch</h2>
                    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
                        <p className="text-lg text-gray-700 mb-8">Have questions? We'd love to hear from you. Send us a message!</p>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-left text-gray-800 font-medium mb-2">Name</label>
                                <input type="text" id="name" name="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" placeholder="Your Name" value={contactData.name}
                                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-left text-gray-800 font-medium mb-2">Email</label>
                                <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" placeholder="your.email@example.com" value={contactData.sender_email}
                                    onChange={(e) => setContactData(prev => ({ ...prev, sender_email: e.target.value }))} />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-left text-gray-800 font-medium mb-2">Message</label>
                                <textarea id="message" name="message" rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" placeholder="Your message..." value={contactData.message}
                                    onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105" onClick={handleSendMessage}>Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-10">
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

export default Home
