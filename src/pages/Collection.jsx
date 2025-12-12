import React, { use, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react'
import { assets, products } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const {products,search, showSearch} = useContext(ShopContext)
  const[showFilters,setShowFilters] = useState(false);
  const[filterProducts,setFilterProducts] = useState([]); 
  const[category, setCategory] = useState([]);
  const[subCategory, setSubCategory] = useState([]);
  const[sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) =>{
    
    if(category.includes(e.target.value)){
        setCategory(prev=> prev.filter(item => item !== e.target.value))

    }
    else{
        setCategory(prev => [...prev, e.target.value])
    }
  }
  const toggleSubCategory = (e) => {
    const value = e.target.value;

    if (subCategory.includes(value)) {
      // Nếu đã có rồi → loại bỏ
      setSubCategory(prev => prev.filter(item => item !== value));
    } else {
      // Nếu chưa có → thêm vào
      setSubCategory(prev => [...prev, value]);
    }
  };

  const applyFilters = () => {
    let productCopy = products.slice();

    if(showSearch && search){
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category));
    }
    if(subCategory.length > 0){
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productCopy)

  }

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b) => b.price - a.price));
        break;
      default:
        applyFilters()
        break;
    }
  }

  useEffect(() => {
  applyFilters();
}, [subCategory, category,search, showSearch,products]);

useEffect(()=>{
  sortProducts();
},[sortType])
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/*filter section*/}
      <div className='min-w-60'>
        <p onClick={()=> setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilters ? 'rotate-90':''}`} src={assets.dropdown_icon} alt=""/>
        </p>
        {/*categories filter*/}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilters ? '': 'hidden'} sm:block`}>
          <p className='mb-3 tetx-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light tetx-gray-600'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} />Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} />Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} />Kids
            </p>
          </div>
        </div>
        {/*subcatagories filter*/}
         <div className={`border border-gray-300 pl-5 py-3 mt-6 my-5 ${showFilters ? '': 'hidden'} sm:block`}>
          <p className='mb-3 tetx-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light tetx-gray-600'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} />Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} />bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/>winterwear
            </p>
          </div>
        </div>
      </div>
      {/*right side*/}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={"COLLECTION"}/>
          <select onChange={(e)=> setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: relavent</option>
            <option value="low-high">Sort by: Low to high</option>
            <option value="high-low">Sort by: High to low</option>
          </select>
        </div>
        {/*products list*/}

        <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}  />
             ) )
          }
        </div>

      </div>
    </div>
  )
}

export default Collection