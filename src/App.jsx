import React, { useState, useEffect, useContext } from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ChatWidget from './components/ChatWidget'
import ServerWakeUpLoader from './components/ServerWakeUpLoader'
import { ShopContext } from './context/ShopContext'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [serverReady, setServerReady] = useState(false)
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000')
  const { setServerReady: setContextServerReady } = useContext(ShopContext)

  useEffect(() => {
    const wakeServer = async () => {
      try {
        console.log('Attempting to wake up server...')
        const response = await fetch(`${backendUrl}/api/ping`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (response.ok && data.success) {
          console.log('Server and database are fully ready:', data)
          setServerReady(true)
          setContextServerReady(true)
        } else {
          console.log('Server not fully ready:', data.message)
          throw new Error(data.message || 'Server not ready')
        }
      } catch (error) {
        console.log('Server wake-up attempt failed, retrying in 3 seconds...', error.message)
        // Retry after 3 seconds
        setTimeout(wakeServer, 3000)
      }
    }

    // Start the wake-up process
    wakeServer()
  }, [backendUrl])

  // Show loading screen until server is ready
  if (!serverReady) {
    return <ServerWakeUpLoader />
  }

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar/>
      <SearchBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/products/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/place-order' element={<PlaceOrder/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      <Footer/>
      <ChatWidget/>
    </div>
  )
}

export default App
