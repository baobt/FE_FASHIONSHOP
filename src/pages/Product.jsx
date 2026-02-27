import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useContext,useState,useEffect } from 'react'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'
const Product = () => {

  const {productId} = useParams()
  const {products, currency, addtoCart, backendUrl, token} = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image,setImage] = useState('')
  const [size, setSize] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')


  const fetchProductData = async() => {
   if (!products || products.length === 0) return;
    products.map((item)=>{
      if(item._id === productId){
        setProductData(item)
        setImage(item.image[0])
        console.log(item)
        return null
      }
    })

  }

  const loadReviews = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/review/product', { productId })
      if (response.data.success) {
        setReviews(response.data.reviews)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitReview = async () => {
    if (!token) {
      toast.error('Please login to submit a review')
      return
    }

    if (reviewRating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a review comment')
      return
    }

    try {
      // Get user info (assuming it's stored in localStorage or context)
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')

      const response = await axios.post(backendUrl + '/api/review/add', {
        userId: userData._id,
        productId,
        rating: reviewRating,
        comment: reviewComment,
        userName: userData.name || 'Anonymous'
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Review submitted successfully!')
        setReviewRating(0)
        setReviewComment('')
        loadReviews() // Reload reviews
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to submit review')
    }
  }

  useEffect(() => {
    fetchProductData();
    loadReviews();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
      
      {/* Product image*/}
      <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {
            productData.image.map((item,index)=>(
              <img onClick={()=> setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt=''/>
            ))
          }
         </div>
         <div className='w-full sm:w-[80%]'>
          <img className='w-full h-auto' src={image} alt=''/>
         </div>
      </div>
      {/* Product information*/}
          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            {reviews && reviews.length > 0 && (
              <div className='flex items-center gap-2 mt-2'>
                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    return (
                      <span
                        key={star}
                        className={`text-lg ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
                <span className='text-sm text-gray-600'>
                  ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                </span>
              </div>
            )}
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price.toLocaleString()}</p>

            {/* Sales Status */}
            <div className='mt-3 flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Sold:</span>
                <span className='font-semibold text-green-600'>{productData.salesCount || 0} items</span>
              </div>
              {productData.salesCount === 0 && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                  Not sold yet
                </span>
              )}
              {productData.salesCount > 0 && productData.salesCount < 10 && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  Low sales
                </span>
              )}
              {productData.salesCount >= 10 && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                  Popular
                </span>
              )}
            </div>

            <p className='mt-5 text-gray-500 md:w:4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>  
              <p>Select Size</p>
              <div className='flex gap-2'>
                {
                  productData.sizes.map((item,index)=>(
                      <button
                        onClick={()=>setSize(item)}
                        className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} ${(productData.sizeStocks && productData.sizeStocks[item] === 0) || (!productData.sizeStocks) ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                        key={index}
                        disabled={(productData.sizeStocks && productData.sizeStocks[item] === 0) || (!productData.sizeStocks)}
                      >
                        {item}
                        {productData.sizeStocks && productData.sizeStocks[item] <= 0 && <span className='ml-1 text-red-500'>X</span>}
                      </button>
                  ))
                }
              </div>
            </div>
            <button onClick={()=>addtoCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>  
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>

            </div>
          </div>
      </div>



      {/* Reviews Section */}
      <div className='mt-20'>
        <div className='text-2xl mb-6'>
          <Title text1={'PRODUCT'} text2={'REVIEWS'} />
        </div>

        {/* Existing Reviews */}
        <div className='space-y-4 mb-8'>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className='border rounded-lg p-4 bg-white'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                      <span className='text-sm font-medium text-gray-600'>
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='font-medium text-gray-900'>{review.userName}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className='text-sm text-gray-500 ml-1'>({review.rating}/5)</span>
                  </div>
                </div>
                <p className='text-gray-700 mb-2'>{review.comment}</p>
                <p className='text-xs text-gray-500'>
                  {new Date(review.date).toLocaleDateString()}
                </p>

                {/* Admin Reply */}
                {review.adminReply && (
                  <div className='mt-4 ml-6 border-l-4 border-blue-500 pl-4 bg-blue-50 rounded p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs font-bold text-white'>A</span>
                      </div>
                      <span className='font-medium text-blue-900'>Admin Reply</span>
                      <span className='text-xs text-blue-600'>
                        {new Date(review.adminReplyDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className='text-blue-800 leading-relaxed'>{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className='border rounded-lg p-6 bg-gray-50'>
          <h3 className='text-lg font-medium mb-4'>Write a Review</h3>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Rating
              </label>
              <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    className='text-2xl hover:scale-110 transition'
                    onClick={() => setReviewRating(star)}
                  >
                    {star <= reviewRating ? '⭐' : '☆'}
                  </button>
                ))}
                {reviewRating > 0 && (
                  <span className='ml-2 text-sm text-gray-600'>
                    {reviewRating} star{reviewRating > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Your Review
              </label>
              <textarea
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={4}
                placeholder='Share your thoughts about this product...'
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>

            <button
              onClick={submitReview}
              className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50'
              disabled={!token}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

    </div>
  ):<div className='opacity-0'></div>
}

export default Product
