import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { use } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const [currentState, setCurrenState] = useState('Login')
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResendVerification = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/resend-verification', {email})
      if(response.data.success){
        toast.success('Verification code sent to your email!')
      }else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to resend verification code')
    }
  }

  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    setLoading(true)

    try{

      if(currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register',{name,password,email})
        if(response.data.success){
          toast.success('Registration successful! Please check your email for verification code.')
          setShowVerification(true)
          setCurrenState('Verify Email')
        }else {
          toast.error(response.data.message)
        }

      }else if(currentState === 'Verify Email'){

        const response = await axios.post(backendUrl + '/api/user/verify-email', {email, code: verificationCode})
        if(response.data.success){
          toast.success('Email verified successfully! You can now login.')
          setShowVerification(false)
          setCurrenState('Login')
          setVerificationCode('')
        }else {
          toast.error(response.data.message)
        }

      }else if(currentState === 'Forgot Password'){

        const response = await axios.post(backendUrl + '/api/user/forgot-password', {email})
        if(response.data.success){
          toast.success('Password reset code sent to your email!')
          setShowForgotPassword(true)
          setCurrenState('Reset Password')
        }else {
          toast.error(response.data.message)
        }

      }else if(currentState === 'Reset Password'){

        const response = await axios.post(backendUrl + '/api/user/reset-password', {email, code: resetCode, newPassword})
        if(response.data.success){
          toast.success('Password reset successfully! You can now login.')
          setShowForgotPassword(false)
          setCurrenState('Login')
          setResetCode('')
          setNewPassword('')
        }else {
          toast.error(response.data.message)
        }

      }else{

        const response = await axios.post(backendUrl + '/api/user/login', {email,password})
        if(response.data.success){
          setToken(response.data.token)
           localStorage.setItem('token',response.data.token)
        } else {
          if(response.data.requiresVerification){
            // Email not verified, show verification form
            setShowVerification(true)
            setCurrenState('Verify Email')
            toast.info('Please verify your email first')
          } else {
            toast.error(response.data.message)
          }
        }

      }

    }catch (error){
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])


  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 text-gray-800"
    >
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-semibold tracking-wide">
          {currentState}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {currentState === 'Login'
            ? 'Welcome back, please sign in'
            : currentState === 'Sign Up'
            ? 'Create your account to continue'
            : currentState === 'Verify Email'
            ? 'Enter the verification code sent to your email'
            : currentState === 'Forgot Password'
            ? 'Enter your email to reset password'
            : 'Enter the reset code and new password'}
        </p>
      </div>

      {/* Verification Code */}
      {currentState === 'Verify Email' && (
        <input
          onChange={(e) => setVerificationCode(e.target.value)}
          value={verificationCode}
          type="text"
          placeholder="Enter 6-digit verification code"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition text-center text-lg font-mono"
          maxLength="6"
          required
        />
      )}

      {/* Name */}
      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Your name"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition"
          required
        />
      )}

      {/* Email */}
      {(currentState === 'Login' || currentState === 'Sign Up' || currentState === 'Forgot Password') && (
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition"
          required
        />
      )}

      {/* Reset Code */}
      {currentState === 'Reset Password' && (
        <input
          onChange={(e) => setResetCode(e.target.value)}
          value={resetCode}
          type="text"
          placeholder="Enter 6-digit reset code"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition text-center text-lg font-mono"
          maxLength="6"
          required
        />
      )}

      {/* New Password */}
      {currentState === 'Reset Password' && (
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition"
          required
        />
      )}

      {/* Password */}
      {(currentState === 'Login' || currentState === 'Sign Up') && (
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black transition"
          required
        />
      )}

      {/* Actions */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        {currentState === 'Login' && (
          <p
            onClick={() => setCurrenState('Forgot Password')}
            className="cursor-pointer hover:text-black transition"
          >
            Forgot password?
          </p>
        )}

        {currentState === 'Verify Email' && (
          <p
            onClick={handleResendVerification}
            className="cursor-pointer hover:text-black transition"
          >
            Resend code
          </p>
        )}

        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrenState('Sign Up')}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Create account
          </p>
        ) : currentState === 'Forgot Password' || currentState === 'Reset Password' ? (
          <p
            onClick={() => {
              setCurrenState('Login')
              setShowForgotPassword(false)
              setResetCode('')
              setNewPassword('')
            }}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Back to login
          </p>
        ) : currentState === 'Verify Email' ? (
          <p
            onClick={() => {
              setCurrenState('Login')
              setShowVerification(false)
              setVerificationCode('')
            }}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Back to login
          </p>
        ) : (
          <p
            onClick={() => setCurrenState('Login')}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Login here
          </p>
        )}
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : (
          currentState === 'Login' ? 'Sign In' :
          currentState === 'Sign Up' ? 'Sign Up' :
          currentState === 'Verify Email' ? 'Verify Email' :
          currentState === 'Forgot Password' ? 'Send Reset Code' :
          'Reset Password'
        )}
      </button>
    </form>
  </div>
)

}

export default Login
