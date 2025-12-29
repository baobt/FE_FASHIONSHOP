import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14 min-h-[80vh]'>

      <div className='text-2xl mb-10'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div className='flex flex-col gap-6'>
        {cartData.map((item, index) => {

          const productData = products.find(product => product._id === item._id)

          return (
            <div
              key={index}
              className='flex flex-col sm:flex-row gap-6 p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition'
            >

              {/* Image */}
              <img
                src={productData.image[0]}
                alt=''
                className='w-28 h-36 object-cover rounded-xl'
              />

              {/* Info */}
              <div className='flex-1 flex flex-col justify-between'>

                <div>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-800'>
                    {productData.name}
                  </h3>

                  <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
                    <span>{currency}{productData.price}</span>
                    <span className='px-3 py-1 rounded-full border bg-gray-50'>
                      Size {item.size}
                    </span>
                  </div>

                  <p className='text-xs text-gray-500 mt-1'>
                    Stock: {productData?.sizeStocks?.[item.size] || 0} available
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center justify-between mt-4'>

                  <input
                    type='number'
                    min={1}
                    max={productData?.sizeStocks?.[item.size] || 0}
                    defaultValue={item.quantity}
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(item._id, item.size, Number(e.target.value))
                    }
                    className='w-20 px-3 py-2 rounded-xl border bg-gray-50 focus:bg-white focus:border-black outline-none text-sm'
                  />

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className='flex items-center gap-2 text-sm text-red-500 hover:text-red-700'
                  >
                    <img src={assets.bin_icon} className='w-4' alt='' />
                    Remove
                  </button>

                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className='flex justify-end mt-20'>
        <div className='w-full sm:w-[420px] bg-white p-6 rounded-2xl shadow-sm'>
          <CartTotal />
          <button
            onClick={() => {
              if (!token) {
                toast.error('Please login to proceed to checkout')
                navigate('/login')
              } else {
                navigate('/place-order')
              }
            }}
            className='w-full mt-6 bg-black text-white py-4 rounded-xl text-sm font-semibold hover:bg-gray-900 transition'
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>

    </div>
  )
}

export default Cart
