import React from 'react'

const ServerWakeUpLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Waking up server...
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Our server is starting up. This may take <span className="font-semibold text-blue-600">30-60 seconds</span> on first visit.
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500">
          <p>Free hosting may sleep after inactivity</p>
          <p className="mt-1">Thank you for your patience! 🚀</p>
        </div>
      </div>
    </div>
  )
}

export default ServerWakeUpLoader