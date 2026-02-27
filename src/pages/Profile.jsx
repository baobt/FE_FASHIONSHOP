import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { User, Package, Calendar, Heart, Edit, ShoppingBag, MapPin, X, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { userOrders, backendUrl, token, wishlist } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [updating, setUpdating] = useState(false)

  // Helper function to decode JWT
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      return decodedPayload
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          // Decode token to get userId
          const decoded = decodeJWT(token)
          if (!decoded || !decoded.id) {
            console.error('Invalid token')
            setLoading(false)
            return
          }
          const userId = decoded.id

          // Fetch user profile
          const profileResponse = await fetch(`${backendUrl}/api/user/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token
            },
            body: JSON.stringify({ userId })
          })
          const profileData = await profileResponse.json()

          if (profileData.success) {
            // Debug: Check what createdAt looks like
            console.log('User createdAt:', profileData.user.createdAt)
            console.log('User createdAt type:', typeof profileData.user.createdAt)

            const createdAt = profileData.user.createdAt
            let joinDate = 'N/A'

            if (createdAt) {
              try {
                const date = new Date(createdAt)
                if (!isNaN(date.getTime())) {
                  joinDate = date.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              } catch (error) {
                console.error('Error parsing createdAt:', error)
              }
            }

            setUser({
              _id: profileData.user._id,
              name: profileData.user.name,
              email: profileData.user.email,
              joinDate: joinDate
            })
          }

          // Fetch user orders
          const ordersResponse = await fetch(`${backendUrl}/api/order/userorders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token
            }
          })
          const ordersData = await ordersResponse.json()
          if (ordersData.success) {
            setOrders(ordersData.activeOrders || [])
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [token, backendUrl])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'text-blue-600 bg-blue-50'
      case 'Packing': return 'text-yellow-600 bg-yellow-50'
      case 'Shipped': return 'text-purple-600 bg-purple-50'
      case 'Out for delivery': return 'text-orange-600 bg-orange-50'
      case 'Delivered': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const handleEditClick = () => {
    // Pre-fill form with current user data
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowEditModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (formData.name.trim().length < 2) {
      alert('Tên phải có ít nhất 2 ký tự')
      return
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      alert('Số điện thoại không hợp lệ')
      return
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        alert('Mật khẩu mới phải có ít nhất 8 ký tự')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp')
        return
      }
      if (!formData.currentPassword) {
        alert('Vui lòng nhập mật khẩu hiện tại')
        return
      }
    }

    setUpdating(true)

    try {
      const decoded = decodeJWT(token)
      if (!decoded || !decoded.id) {
        alert('Token không hợp lệ')
        return
      }

      const updateData = {
        userId: decoded.id,
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined
      }

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch(`${backendUrl}/api/user/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (data.success) {
        // Update local user state
        setUser(prev => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone
        }))

        setShowEditModal(false)
        setFormData({
          name: '',
          phone: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        alert('Cập nhật hồ sơ thành công!')
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật hồ sơ')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setUpdating(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div
        className="relative h-48 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assets.banner_LV1})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-light">{user?.name || 'User'}</h1>
            <p className="text-gray-300 text-sm mt-1">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Account Info */}
          <div className="lg:col-span-1 space-y-6">

            {/* Account Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Tài khoản của tôi</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email đăng nhập</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tham gia từ</p>
                  <p className="text-sm font-medium text-gray-900">{user.joinDate}</p>
                </div>
              </div>
              <button
                onClick={handleEditClick}
                className="w-full mt-4 bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa hồ sơ
              </button>
            </div>

            {/* Appointments Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Cuộc hẹn của tôi</h3>
              </div>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">Chưa có cuộc hẹn nào</p>
                <button className="bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm">
                  Đặt lịch hẹn tại cửa hàng
                </button>
              </div>
            </div>

            {/* Wishlist Card - Only show if user is logged in */}
            {token && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Danh sách yêu thích</h3>
                </div>

                {wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {wishlist.slice(0, 4).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group block"
                      >
                        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">₫{product.price.toLocaleString()}</p>
                      </Link>
                    ))}
                    {wishlist.length > 4 && (
                      <div className="col-span-2 text-center pt-2">
                        <Link
                          to="/collection"
                          className="text-sm text-gray-600 hover:text-black font-medium"
                        >
                          Xem thêm ({wishlist.length - 4} sản phẩm khác)
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống</p>
                    <Link
                      to="/collection"
                      className="bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm inline-block"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column - Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Đơn hàng của tôi</h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h4>
                  <p className="text-sm text-gray-500 mb-6">Hãy bắt đầu mua sắm để xem đơn hàng của bạn tại đây</p>
                  <Link
                    to="/collection"
                    className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Bắt đầu mua hàng
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Đơn hàng #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₫{order.amount.toLocaleString()}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{order.items.length} sản phẩm</span>
                          {order.address && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{order.address.city}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <Link
                          to={`/orders`}
                          className="text-sm text-black hover:text-gray-600 font-medium"
                        >
                          Xem chi tiết →
                        </Link>
                      </div>
                    </div>
                  ))}

                  {orders.length > 5 && (
                    <div className="text-center pt-4">
                      <Link
                        to="/orders"
                        className="text-sm text-gray-600 hover:text-black font-medium"
                      >
                        Xem tất cả đơn hàng ({orders.length})
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa hồ sơ</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đầy đủ
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="Nhập tên đầy đủ"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Current Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
