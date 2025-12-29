import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = 'đ'
    const delivery_fee = 30000
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState()
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [wishlist, setWishlist] = useState([])
    const navigate = useNavigate()

    const addtoCart = async (itemId,size) => {

        // Check if user is logged in
        if (!token) {
            toast.error('Please login to add items to cart')
            navigate('/login')
            return
        }

        if(!size){
            toast.error("Select Product size")
            return
        }

        // Check stock availability
        const product = products.find(p => p._id === itemId)
        if (!product) {
            toast.error("Product not found")
            return
        }

        const currentQuantity = cartItems[itemId]?.[size] || 0
        const availableStock = product.sizeStocks?.[size] || 0

        if (availableStock === 0) {
            toast.error(`Size ${size} is out of stock`)
            return
        }

        if (currentQuantity + 1 > availableStock) {
            toast.error(`Cannot add more. Only ${availableStock} items available in size ${size}`)
            return
        }

        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }

            else{
                cartData[itemId][size] = 1
            }
        }
        else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        setCartItems(cartData);

        try {
            await axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    
    const getCartCount = ()=>{
        let totalCount = 0
        for(const items in cartItems){   
            for(const item in cartItems[items]){
                try{
                   if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item]
                   }             
                }catch(error){
                    
                }
            }
        }
        return totalCount
    }


    const updateQuantity = async (itemId, size, quantity) => {

        // Check stock availability
        const product = products.find(p => p._id === itemId)
        if (!product) {
            toast.error("Product not found")
            return
        }

        const availableStock = product.sizeStocks?.[size] || 0

        if (quantity > availableStock) {
            toast.error(`Cannot set quantity above available stock. Only ${availableStock} items available in size ${size}`)
            return
        }

        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)

        if(token){
            try {

                await axios.post(backendUrl + '/api/cart/update' , {itemId, size, quantity},{headers:{token}})

            } catch (error) {
                 console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price *cartItems[items][item]
                    }
                }catch(error){

                }
            }
        }
        return totalAmount
    }


    const getProductsData = async () => {
        try{

            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.product)
            }else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Refresh product data after stock changes
    const refreshProducts = async () => {
        await getProductsData()
    }

    const getUserCart = async (token) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if(response.data.success){
                setCartItems(response.data.cartData)
            }

        } catch (error) {
             console.log(error)
            toast.error(error.message)
        }
    }

    const getUserWishlist = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/user/get-wishlist', {}, {headers:{token}})
            if(response.data.success){
                setWishlist(response.data.wishlist)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const toggleWishlist = async (productId) => {
        if (!token) {
            toast.error('Please login to add to wishlist')
            navigate('/login')
            return
        }

        try {
            const isInWishlist = wishlist.some(item => item._id === productId)
            const action = isInWishlist ? 'remove' : 'add'

            const response = await axios.post(backendUrl + '/api/user/wishlist',
                { productId, action },
                { headers: { token } }
            )

            if (response.data.success) {
                if (action === 'add') {
                    const product = products.find(p => p._id === productId)
                    setWishlist(prev => [...prev, product])
                    toast.success('Added to wishlist')
                } else {
                    setWishlist(prev => prev.filter(item => item._id !== productId))
                    toast.success('Removed from wishlist')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to update wishlist')
        }
    }

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId)
    }

    useEffect(()=>{
        getProductsData()
    },[])


    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            getUserWishlist(localStorage.getItem('token'))
        }
    },[])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems,addtoCart,setCartItems,
        getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, refreshProducts,
        wishlist, toggleWishlist, isInWishlist
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
