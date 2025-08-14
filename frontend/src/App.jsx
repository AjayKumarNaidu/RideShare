import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import TakeRide from './pages/TakeRide'
import OfferRide from './pages/OfferRide'
import Login from './pages/Login'
import Register from './pages/Register'
import Private from './pages/Private'
import EachRidePage from './pages/EachRidePage'
import MyRides from './pages/MyRides'
import CurrentUserProfile from './pages/CurrentUserProfile'
import UserProfile from './pages/UserProfile'
import AllUsers from './pages/AllUsers'
import Maps from './pages/Maps'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={
          <Private>
            <Home />
          </Private>
        } />
        <Route path='/takeride' element={<TakeRide />} />
        <Route path='/takeride/:id' element={<EachRidePage />} />
        <Route path='/offerride' element={<OfferRide />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myrides' element={<MyRides />} />
        <Route path='/currentuserprofile' element={<CurrentUserProfile />} />
        <Route path='/userprofile/:email' element={<UserProfile />} />
        <Route path='/allusers' element={<AllUsers />} />
        <Route path='/maps/:email/:currentUser' element={<Maps />}/>
      </Routes>
    </>
  )
}

export default App
