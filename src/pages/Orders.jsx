import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'

const Orders = () => {

  const {backendUrl, token,currency} = useContext(ShopContext)

  const [activeOrders,setActiveOrders] = useState([])
  const [archivedOrders,setArchivedOrders] = useState([])
  const [activeTab, setActiveTab] = useState('active')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelOrderData, setCancelOrderData] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const cancelReasons = [
    'Thay đổi ý định mua hàng',
    'Tìm thấy sản phẩm tương tự giá rẻ hơn',
    'Thời gian giao hàng quá lâu',
    'Đặt hàng nhầm sản phẩm/size',
    'Không còn nhu cầu sử dụng',
    'Lý do khác'
  ]

  const handleCancelOrder = (item) => {
    setCancelOrderData({
      orderId: item.orderId, // Now we have the actual orderId
      item: item
    })
    setShowCancelModal(true)
  }

  const confirmCancelOrder = async (reason) => {
    if (!cancelOrderData) return

    setCancelling(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        {
          orderId: cancelOrderData.orderId,
          reason: reason
        },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy thành công')
        setShowCancelModal(false)
        setCancelOrderData(null)
        loadOrderData() // Reload orders
      } else {
        toast.error(response.data.message || 'Không thể hủy đơn hàng')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng')
    } finally {
      setCancelling(false)
    }
  }


  const loadOrderData = async () =>{
    try {
      if(!token){
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders' ,{},{headers:{token}})
      if(response.data.success){
        // Process active orders
        let activeOrdersItems = []
        response.data.activeOrders.map((order)=>{
          order.items.map((item)=>{
            item ['status'] = order.status
            item ['payment'] = order.payment
            item ['paymentMethod'] = order.paymentMethod
            item ['date'] = order.date
            item ['orderId'] = order._id // Add orderId for cancel functionality
            activeOrdersItems.push(item)
          })
        })

        // Process archived orders
        let archivedOrdersItems = []
        response.data.archivedOrders.map((order)=>{
          order.items.map((item)=>{
            item ['status'] = order.status
            item ['payment'] = order.payment
            item ['paymentMethod'] = order.paymentMethod
            item ['date'] = order.date
            item ['archivedAt'] = order.archivedAt
            item ['orderId'] = order._id
            archivedOrdersItems.push(item)
          })
        })

        setActiveOrders(activeOrdersItems.reverse())
        setArchivedOrders(archivedOrdersItems.reverse())
      }

    } catch (error) {

    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  const currentOrders = activeTab === 'active' ? activeOrders : archivedOrders

  return (
    <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        {/* Tabs */}
        <div className='flex gap-4 mb-8'>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'archived'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Order History ({archivedOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className='space-y-4'>
          {currentOrders.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <p>{activeTab === 'active' ? 'No active orders' : 'No order history'}</p>
            </div>
          ) : (
            currentOrders.map((item,index)=>(
              <div key={index} className='border rounded-lg p-4 bg-white shadow-sm'>
                <div className='flex flex-col md:flex-row gap-4'>
                  {/* Product Info */}
                  <div className='flex gap-4 flex-1'>
                    <img className='w-16 h-16 object-cover rounded' src={item.image[0]} alt=""/>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>{item.name}</p>
                      <div className='flex items-center gap-4 mt-1 text-sm text-gray-600'>
                        <span>{currency}{item.price.toLocaleString()}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Size: {item.size}</span>
                      </div>
                      <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>{item.paymentMethod}</span>
                      </div>
                      {activeTab === 'archived' && (
                        <p className='text-xs text-gray-400 mt-1'>
                          Archived on {new Date(item.archivedAt || item.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className='flex items-center justify-between md:flex-col md:items-end gap-2'>
                    <div className='flex items-center gap-2'>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'Delivered' ? 'bg-green-500' :
                        item.status === 'Shipped' ? 'bg-blue-500' :
                        item.status === 'Packing' ? 'bg-yellow-500' :
                        item.status === 'Cancelled' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <span className='text-sm font-medium'>{item.status}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      {activeTab === 'active' && item.status === 'Order Placed' && item.paymentMethod === 'COD' && (
                        <button
                          onClick={() => handleCancelOrder(item)}
                          className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition'
                        >
                          Cancel Order
                        </button>
                      )}
                      {activeTab === 'active' && (
                        <button
                          onClick={loadOrderData}
                          className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition'
                        >
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && cancelOrderData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCancelModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hủy đơn hàng</h2>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sản phẩm sẽ hủy:</h3>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <img
                      src={cancelOrderData.item.image[0]}
                      alt={cancelOrderData.item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{cancelOrderData.item.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {cancelOrderData.item.size} • Qty: {cancelOrderData.item.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Lý do hủy đơn hàng:</h3>
                  <div className="space-y-2">
                    {cancelReasons.map((reason, index) => (
                      <button
                        key={index}
                        onClick={() => confirmCancelOrder(reason)}
                        disabled={cancelling}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-sm text-gray-700">{reason}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelling}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Không hủy
                  </button>
                </div>

                {cancelling && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Đang xử lý hủy đơn hàng...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default Orders
