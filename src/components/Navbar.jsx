import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react'

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        setProfileOpen(false)
    }

    return (
        <nav className='bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>

                    {/* Logo */}
                    <Link to='/' className='flex-shrink-0'>
                        <div className='flex items-center space-x-1'>
                            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-indigo-600'>
                                {/* First B */}
                                <path d="M4 4H12C14.2 4 16 5.8 16 8V12C16 14.2 14.2 16 12 16H8V20H12C16.4 20 20 16.4 20 12V8C20 3.6 16.4 0 12 0H4V4Z" fill="currentColor"/>
                                <rect x="8" y="8" width="4" height="4" fill="white"/>
                                {/* Second B - Mirrored */}
                                <path d="M16 4H24C26.2 4 28 5.8 28 8V12C28 14.2 26.2 16 24 16H20V20H24C28.4 20 32 16.4 32 12V8C32 3.6 28.4 0 24 0H16V4Z" fill="currentColor"/>
                                <rect x="20" y="8" width="4" height="4" fill="white"/>
                            </svg>
                            <span className='text-xl font-bold text-gray-900 tracking-tight'>Double B</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:block'>
                        <div className='flex items-center space-x-8'>
                            <NavLink
                                to='/'
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`
                                }
                            >
                                HOME
                            </NavLink>
                            <NavLink
                                to='/collection'
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`
                                }
                            >
                                COLLECTION
                            </NavLink>
                            <NavLink
                                to='/about'
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`
                                }
                            >
                                ABOUT
                            </NavLink>
                            <NavLink
                                to='/contact'
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`
                                }
                            >
                                CONTACT
                            </NavLink>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className='flex items-center space-x-4'>

                        {/* Search */}
                        <button
                            onClick={() => setShowSearch(true)}
                            className='p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors duration-200'
                        >
                            <Search className='h-5 w-5' />
                        </button>

                        {/* Profile */}
                        <div className='relative'>
                            <button
                                onClick={() => token ? setProfileOpen(!profileOpen) : navigate('/login')}
                                className='p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors duration-200'
                            >
                                <User className='h-5 w-5' />
                            </button>

                            {/* Profile Dropdown */}
                            {token && profileOpen && (
                                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
                                    
                                    <button
                                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => { navigate('/orders'); setProfileOpen(false); }}
                                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                                    >
                                        My Orders
                                    </button>
                                    <button
                                        onClick={logout}
                                        className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to='/cart' className='relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors duration-200'>
                            <ShoppingBag className='h-5 w-5' />
                            {getCartCount() > 0 && (
                                <span className='absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setVisible(true)}
                            className='md:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors duration-200'
                        >
                            <Menu className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-50 md:hidden ${visible ? 'block' : 'hidden'}`}>
                <div className='fixed inset-0 bg-black bg-opacity-25' onClick={() => setVisible(false)}></div>
                <div className='fixed right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl'>
                    <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                        <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
                        <button
                            onClick={() => setVisible(false)}
                            className='p-2 text-gray-400 hover:text-gray-600'
                        >
                            <X className='h-5 w-5' />
                        </button>
                    </div>

                    <div className='py-4'>
                        <NavLink
                            to='/'
                            onClick={() => setVisible(false)}
                            className='block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200'
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to='/collection'
                            onClick={() => setVisible(false)}
                            className='block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200'
                        >
                            COLLECTION
                        </NavLink>
                        <NavLink
                            to='/about'
                            onClick={() => setVisible(false)}
                            className='block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200'
                        >
                            ABOUT
                        </NavLink>
                        <NavLink
                            to='/contact'
                            onClick={() => setVisible(false)}
                            className='block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200'
                        >
                            CONTACT
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
