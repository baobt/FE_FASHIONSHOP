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
  // Email verification temporarily disabled
  // const [verificationCode, setVerificationCode] = useState('')
  // const [showVerification, setShowVerification] = useState(false)
  // const [showForgotPassword, setShowForgotPassword] = useState(false)
  // const [resetCode, setResetCode] = useState('')
  // const [newPassword, setNewPassword] = useState('')
  // const [showPassword, setShowPassword] = useState(false)
  // const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Email verification temporarily disabled
  // const handleResendVerification = async () => {
  //   try {
  //     const response = await axios.post(backendUrl + '/api/user/resend-verification', {email})
  //     if(response.data.success){
  //       toast.success('Verification code sent to your email!')
  //     }else {
  //       toast.error(response.data.message)
  //     }
  //   } catch (error) {
  //     toast.error('Failed to resend verification code')
  //   }
  // }

  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    setLoading(true)

    try{

      if(currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register',{name,password,email})
        if(response.data.success){
          toast.success('Registration successful!')
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        }else {
          toast.error(response.data.message)
        }

      }else{

        const response = await axios.post(backendUrl + '/api/user/login', {email,password})
        if(response.data.success){
          setToken(response.data.token)
           localStorage.setItem('token',response.data.token)
        } else {
          toast.error(response.data.message)
        }

      }

      // Email verification temporarily disabled
      /*
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
      */

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
            : 'Create your account to continue'}
        </p>
      </div>

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
      {(currentState === 'Login' || currentState === 'Sign Up') && (
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
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

      {/* Email verification UI temporarily disabled - commented out below */}
      {/*
      <input ... verification code input />
      <input ... email for forgot password />
      <input ... reset code />
      <input ... new password />
      */}

      {/* Actions */}
      <div className="flex justify-end items-center text-sm text-gray-500">
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrenState('Sign Up')}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Create account
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

      {/* Email verification actions temporarily disabled */}
      {/*
      <div className="flex justify-between items-center text-sm text-gray-500">
        {currentState === 'Login' && (
          <p onClick={() => setCurrenState('Forgot Password')}>Forgot password?</p>
        )}
        {currentState === 'Verify Email' && (
          <p onClick={handleResendVerification}>Resend code</p>
        )}
        ... complex conditional logic for different states ...
      </div>
      */}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : (
          currentState === 'Login' ? 'Sign In' : 'Sign Up'
        )}
      </button>
    </form>
  </div>
)

}

export default Login
