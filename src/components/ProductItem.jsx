import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Heart } from 'lucide-react'

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, isInWishlist, token } = useContext(ShopContext)

  return (
    <div className='group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
      <Link to={`/products/${id}`} className='block'>

        {/* Image Container */}
        <div className='relative aspect-square overflow-hidden bg-gray-50'>
          <img
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            src={image[0]}
            alt={name}
          />

          {/* Wishlist Button - Only show if user is logged in */}
          {token && (
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleWishlist(id)
              }}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isInWishlist(id)
                  ? 'bg-red-500 text-white opacity-100'
                  : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
              }`}
              title={isInWishlist(id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className='p-4'>
          <h3 className='text-gray-900 font-semibold text-sm mb-2 line-clamp-2 hover:text-indigo-600 transition-colors duration-200'>
            {name}
          </h3>

          <span className='text-lg font-bold text-gray-900'>
            {currency}{price.toLocaleString()}
          </span>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem
