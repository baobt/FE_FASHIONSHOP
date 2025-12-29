import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext)

  const [showFilters, setShowFilters] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relavent')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // Fixed at 12 for frontend pagination

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    if (subCategory.includes(value)) {
      setSubCategory(prev => prev.filter(item => item !== value))
    } else {
      setSubCategory(prev => [...prev, value])
    }
  }

  const applyFilters = () => {
    let productCopy = products.slice()

    if (showSearch && search) {
      productCopy = productCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(item =>
        category.includes(item.category)
      )
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )
    }

    setFilterProducts(productCopy)
  }

  const sortProducts = () => {
    let fpCopy = filterProducts.slice()

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price))
        break
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price))
        break
      default:
        applyFilters()
        break
    }
  }

  // Pagination helpers
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filterProducts.slice(startIndex, endIndex)

  useEffect(() => {
    applyFilters()
    setCurrentPage(1) // Reset to first page when filters change
  }, [subCategory, category, search, showSearch, products])

  useEffect(() => {
    sortProducts()
    setCurrentPage(1) // Reset to first page when sorting changes
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-6 pt-10 border-t'>

      {/* ===== FILTER SIDEBAR ===== */}
      <aside className='sm:min-w-[260px]'>

        <div
          onClick={() => setShowFilters(!showFilters)}
          className='flex items-center justify-between cursor-pointer sm:cursor-default'
        >
          <h2 className='text-xl font-semibold'>FILTERS</h2>
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden transition-transform ${showFilters ? 'rotate-90' : ''}`}
            alt=''
          />
        </div>

        {/* Category */}
        <div className={`mt-6 rounded-lg border bg-white shadow-sm p-4 ${showFilters ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 font-medium text-sm'>CATEGORIES</p>
          <div className='space-y-2 text-sm text-gray-600'>
            {['Men', 'Women', 'Kids'].map(item => (
              <label key={item} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={item}
                  onChange={toggleCategory}
                  className='accent-black'
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Sub Category */}
        <div className={`mt-5 rounded-lg border bg-white shadow-sm p-4 ${showFilters ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 font-medium text-sm'>TYPE</p>
          <div className='space-y-2 text-sm text-gray-600'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map(item => (
              <label key={item} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={item}
                  onChange={toggleSubCategory}
                  className='accent-black'
                />
                {item}
              </label>
            ))}
          </div>
        </div>

      </aside>

      {/* ===== PRODUCTS ===== */}
      <main className='flex-1'>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <Title text1='ALL' text2='COLLECTION' />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border rounded-md px-3 py-1.5 text-sm focus:outline-none'
          >
            <option value='relavent'>Sort by: Relevant</option>
            <option value='low-high'>Price: Low → High</option>
            <option value='high-low'>Price: High → Low</option>
          </select>
        </div>

        {/* Results Header */}
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm text-gray-600'>
            Showing {startIndex + 1}-{Math.min(endIndex, filterProducts.length)} of {filterProducts.length} products
          </p>
        </div>

        {/* Product Grid */}
        {currentProducts.length === 0 ? (
          <div className='text-center text-gray-500 py-20'>
            No products found.
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8'>
            {currentProducts.map((item, index) => (
              <ProductItem
                key={startIndex + index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 mt-12'>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className='flex gap-1'>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className='px-2 py-2 text-gray-500'>...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                      currentPage === totalPages
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Next
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default Collection
