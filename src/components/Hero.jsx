import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const heroImages = [
  assets.hero_img,
  assets.hero_vogue1,
  assets.hero_vogue2,
]

const Hero = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className='relative h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>

      {/* Background Images */}
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt=''
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-1000 ease-in-out
            ${index === current ? 'opacity-90 scale-100' : 'opacity-0 scale-105'}
          `}
        />
      ))}

      {/* Enhanced Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent'></div>

      {/* Content */}
      <div className='relative z-10 h-full flex items-center'>
        <div className='max-w-7xl mx-auto px-6 md:px-16 lg:px-24 w-full'>
          <div className='max-w-xl text-white'>

            <div className='flex items-center gap-3 mb-6'>
              <span className='w-12 h-[3px] bg-indigo-500 rounded-full'></span>
              <p className='uppercase tracking-wider text-xs font-bold text-indigo-300'>
                Premium Collection
              </p>
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Discover <br />
              <span className='text-indigo-400'>Latest Trends</span>
            </h1>

            <p className='text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed'>
              Elevate your style with our curated collection of premium fashion.
              Quality craftsmanship meets contemporary design.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/collection'
                className='inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'
              >
                Shop Collection
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>

              <Link
                to='/about'
                className='inline-flex items-center justify-center border-2 border-white/30 hover:border-white text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:bg-white hover:text-black'
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className='flex gap-8 mt-12'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>500+</div>
                <div className='text-sm text-gray-400 uppercase tracking-wide'>Products</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>10K+</div>
                <div className='text-sm text-gray-400 uppercase tracking-wide'>Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-white'>50+</div>
                <div className='text-sm text-gray-400 uppercase tracking-wide'>Brands</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Dots */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10'>
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all
              ${i === current ? 'bg-white scale-125' : 'bg-white/50'}
            `}
          />
        ))}
      </div>

    </section>
  )
}

export default Hero
