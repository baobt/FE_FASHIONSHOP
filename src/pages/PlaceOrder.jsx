import React, { useContext, useState, useEffect, useRef } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const {
    navigate,
    token,
    cartItems,
    getCartAmount,
    getCartCount
  } = useContext(ShopContext)

  const [orderPlaced, setOrderPlaced] = useState(false)

  // Check if user is logged in and cart not empty (only if order not placed yet)
  useEffect(() => {
    if (!token) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    // Only check cart empty if order hasn't been placed yet
    if (!orderPlaced && getCartCount() === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }
  }, [token, navigate, getCartCount, orderPlaced])

  // Don't render anything if not logged in
  if (!token) {
    return null
  }

  const [method, setMethod] = useState('cod')
  const {
    backendUrl,
    setCartItems,
    delivery_fee,
    products,
    refreshProducts
  } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const paypalRef = useRef()

  const onChangeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.street &&
      formData.city &&
      formData.zipcode &&
      formData.country &&
      formData.phone
    )
  }

  const prepareOrderData = () => {
    let orderItems = []

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = structuredClone(
            products.find(product => product._id === items)
          )
          if (itemInfo) {
            itemInfo.size = item
            itemInfo.quantity = cartItems[items][item]
            orderItems.push(itemInfo)
          }
        }
      }
    }

    return {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee
    }
  }

  useEffect(() => {
    if (method === 'paypal' && window.paypal && paypalRef.current && isFormValid()) {
      paypalRef.current.innerHTML = ''

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (getCartAmount() + delivery_fee).toFixed(2)
              }
            }]
          })
        },
        onApprove: async (data, actions) => {
          try {
            await actions.order.capture()
            const response = await axios.post(
              backendUrl + '/api/order/paypal',
              prepareOrderData(),
              { headers: { token } }
            )

            if (response.data.success) {
              toast.success('Payment successful!')
              setCartItems({})
              refreshProducts()
              navigate('/orders')
            }
          } catch {
            toast.error('Payment failed')
          }
        }
      }).render(paypalRef.current)
    }
  }, [method, formData, cartItems])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const orderData = prepareOrderData()

      if (method === 'cod') {
        const res = await axios.post(
          backendUrl + '/api/order/place',
          orderData,
          { headers: { token } }
        )
        if (res.data.success) {
          setOrderPlaced(true) // Mark order as placed
          setCartItems({})
          refreshProducts()
          navigate('/orders')
        }
      }

      if (method === 'momo') {
        const res = await axios.post(
          backendUrl + '/api/order/momo',
          orderData,
          { headers: { token } }
        )
        if (res.data.success) {
          window.location.href = res.data.payUrl
        } else {
          toast.error(res.data.message || 'MoMo payment failed')
        }
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 border-t'
    >

      {/* ===== LEFT: DELIVERY INFO ===== */}
      <div className='w-full sm:max-w-[520px] bg-white rounded-2xl p-8 shadow-sm space-y-6'>

  <Title text1={'DELIVERY'} text2={'INFORMATION'} />

  {/* First / Last Name */}
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>First name</label>
      <input
        required
        name='firstName'
        value={formData.firstName}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='text'
      />
    </div>

    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>Last name</label>
      <input
        required
        name='lastName'
        value={formData.lastName}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='text'
      />
    </div>
  </div>

  {/* Email */}
  <div className='flex flex-col gap-1'>
    <label className='text-sm font-medium text-gray-600'>Email address</label>
    <input
      required
      name='email'
      value={formData.email}
      onChange={onChangeHandler}
      className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
      type='email'
    />
  </div>

  {/* Street */}
  <div className='flex flex-col gap-1'>
    <label className='text-sm font-medium text-gray-600'>Street address</label>
    <input
      required
      name='street'
      value={formData.street}
      onChange={onChangeHandler}
      className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
      type='text'
    />
  </div>

  {/* City / State */}
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>City</label>
      <input
        required
        name='city'
        value={formData.city}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='text'
      />
    </div>

    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>State</label>
      <input
        name='state'
        value={formData.state}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='text'
      />
    </div>
  </div>

  {/* Zip / Country */}
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>Zip code</label>
      <input
        required
        name='zipcode'
        value={formData.zipcode}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='number'
      />
    </div>

    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-600'>Country</label>
      <input
        required
        name='country'
        value={formData.country}
        onChange={onChangeHandler}
        className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
        type='text'
      />
    </div>
  </div>

  {/* Phone */}
  <div className='flex flex-col gap-1'>
    <label className='text-sm font-medium text-gray-600'>Phone number</label>
    <input
      required
      name='phone'
      value={formData.phone}
      onChange={onChangeHandler}
      className='px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-black focus:outline-none'
      type='number'
    />
  </div>

</div>

      {/* ===== RIGHT: PAYMENT ===== */}
      <div className='space-y-6'>
        <div className='bg-white rounded-2xl shadow-sm p-6'>
          <CartTotal />
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-6 space-y-5'>
          <Title text1='PAYMENT' text2='METHOD' />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {[
              { id: 'paypal', img: assets.paypal_logo },
              { id: 'momo', img: assets.momo_logo },
              { id: 'cod', text: 'CASH ON DELIVERY' }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setMethod(item.id)}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-center gap-3 transition
                ${method === item.id ? 'border-black ring-1 ring-black' : 'hover:border-gray-400'}`}
              >
                {item.img ? (
                  <img src={item.img} className='h-6' />
                ) : (
                  <p className='text-sm font-medium'>{item.text}</p>
                )}
              </div>
            ))}
          </div>

          {method === 'paypal' && (
            <div className='mt-4'>
              {!isFormValid() ? (
                <div className='text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                  Please complete delivery information to use PayPal.
                </div>
              ) : (
                <div ref={paypalRef} />
              )}
            </div>
          )}

          {method !== 'paypal' && (
            <button
              type='submit'
              className='w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition'
            >
              PLACE ORDER
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
