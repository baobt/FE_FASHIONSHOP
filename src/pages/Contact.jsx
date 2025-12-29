import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className="px-4 md:px-16">

      {/* Title */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
        <p className="text-gray-500 text-sm mt-2">
          We’d love to hear from you
        </p>
      </div>

      {/* Content */}
      <div className='my-14 flex flex-col md:flex-row items-center gap-14 mb-28'>

        {/* Image */}
        <img
          className='w-full md:max-w-[480px] rounded-2xl shadow-md'
          src={assets.contact_img}
          alt='Contact'
        />

        {/* Info Card */}
        <div className='bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6 w-full md:w-1/2'>

          <div>
            <p className='font-semibold text-lg text-gray-800'>Our Store</p>
            <p className='text-gray-600 mt-2 leading-relaxed'>
              234 Võ Thị Sáu <br />
              Ward 1, District 3 <br />
              Ho Chi Minh City
            </p>
          </div>

          <div>
            <p className='text-gray-600'>
              <span className="font-medium text-gray-800">Tel:</span> 0123 456 789
            </p>
            <p className='text-gray-600'>
              <span className="font-medium text-gray-800">Email:</span> bienthaibao111@gmail.com
            </p>
          </div>

          <hr />

          <div>
            <p className='font-semibold text-lg text-gray-800'>
              Careers at Forever
            </p>
            <p className='text-gray-600 mt-2'>
              Learn more about our team, culture and job openings.
            </p>
          </div>

          <button className='mt-2 w-fit border border-black px-8 py-3 text-sm font-medium rounded-full
            hover:bg-black hover:text-white transition-all duration-300'>
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
