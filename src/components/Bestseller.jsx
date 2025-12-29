import React from 'react'
import Title from './Title'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useEffect } from 'react'
import { useState } from 'react'
import ProductItem from './ProductItem'
const Bestseller = () => {

    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
        // Sort by sales count (highest first), filter out products with 0 sales
        const bestProduct = products
            .filter((item) => item.salesCount > 0)
            .sort((a, b) => b.salesCount - a.salesCount);
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])


    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Our most loved products, chosen by thousands of happy customers.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller?.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default Bestseller
