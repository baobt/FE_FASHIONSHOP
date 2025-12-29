import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='mt-32 bg-gray-100 text-gray-600'>
      <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm'>

        {/* Brand */}
        <div>
          <div className='flex items-center space-x-2 mb-4'>
            <svg width="40" height="36" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-indigo-600'>
              {/* First B */}
              <path d="M4 4H12C14.2 4 16 5.8 16 8V12C16 14.2 14.2 16 12 16H8V20H12C16.4 20 20 16.4 20 12V8C20 3.6 16.4 0 12 0H4V4Z" fill="currentColor"/>
              <rect x="8" y="8" width="4" height="4" fill="white"/>
              {/* Second B - Mirrored */}
              <path d="M16 4H24C26.2 4 28 5.8 28 8V12C28 14.2 26.2 16 24 16H20V20H24C28.4 20 32 16.4 32 12V8C32 3.6 28.4 0 24 0H16V4Z" fill="currentColor"/>
              <rect x="20" y="8" width="4" height="4" fill="white"/>
            </svg>
            <span className='text-2xl font-bold text-gray-900 tracking-tight'>Double B</span>
          </div>
          <p className='leading-relaxed'>
           Double B is a contemporary fashion brand that emphasizes minimal design, premium quality, and a seamless shopping experience.
          </p>
        </div>

        {/* Company */}
        <div>
          <p className='text-base font-semibold text-gray-800 mb-4'>
            COMPANY
          </p>
          <ul className='space-y-2'>
            <li className='hover:text-black cursor-pointer'>Home</li>
            <li className='hover:text-black cursor-pointer'>About Us</li>
            <li className='hover:text-black cursor-pointer'>Collection</li>
            <li className='hover:text-black cursor-pointer'>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-base font-semibold text-gray-800 mb-4'>
            CONTACT
          </p>
          <ul className='space-y-2'>
            <li>(+84) 896 648 934</li>
            <li>bienthaibao111@gmail.com</li>
            <li className='text-xs text-gray-500'>
              Ho Chi Minh City, Vietnam
            </li>
          </ul>
        </div>

      </div>

      <div className='border-t border-gray-300'>
        <p className='py-4 text-center text-xs text-gray-500'>
          © 2025 DoubleB. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
