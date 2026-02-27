import React, { useState, useEffect, useContext, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const ChatWidget = () => {
  const { token, backendUrl } = useContext(ShopContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    if (token && !socket) {
      const newSocket = io(backendUrl.replace('/api', ''), {
        transports: ['websocket', 'polling']
      })

      newSocket.on('connect', () => {
        console.log('Connected to chat server')

        // Decode token to get userId
        const decoded = decodeJWT(token)
        if (decoded && decoded.id) {
          newSocket.emit('join', decoded.id)
        }
      })

      // Listen for new admin messages
      newSocket.on('new_admin_message', (data) => {
        if (data.conversationId === conversation?._id) {
          fetchMessages()
          toast.info('Bạn có tin nhắn mới từ admin!')
        }
      })

      // Listen for typing indicators
      newSocket.on('admin_typing', (data) => {
        // Handle typing indicator if needed
      })

      setSocket(newSocket)
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [token, backendUrl])

  // Helper function to decode JWT
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      return decodedPayload
    } catch (error) {
      return null
    }
  }

  // Get or create conversation
  const getConversation = async () => {
    if (!token) return

    try {
      const decoded = decodeJWT(token)
      if (!decoded || !decoded.id) return

      const response = await fetch(`${backendUrl}/api/chat/get-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ userId: decoded.id })
      })

      const data = await response.json()
      if (data.success) {
        setConversation(data.conversation)
        fetchMessages(data.conversation._id)
      }
    } catch (error) {
      console.error('Error getting conversation:', error)
    }
  }

  // Fetch messages
  const fetchMessages = async (conversationId = conversation?._id) => {
    if (!token || !conversationId) return

    try {
      const response = await fetch(`${backendUrl}/api/chat/get-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ conversationId })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || !token || loading) return

    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/api/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          conversationId: conversation._id,
          message: newMessage.trim()
        })
      })

      const data = await response.json()
      if (data.success) {
        // Emit socket event
        const decoded = decodeJWT(token)
        if (socket && decoded) {
          socket.emit('send_message', {
            conversationId: conversation._id,
            message: newMessage.trim(),
            userId: decoded.id
          })
        }

        setMessages(prev => [...prev, data.message])
        setNewMessage('')
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  // Handle opening chat
  const handleOpenChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    if (!conversation) {
      getConversation()
    }
  }

  // Handle closing chat
  const handleCloseChat = () => {
    setIsOpen(false)
    setConversation(null)
    setMessages([])
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Only show widget if user is logged in
  if (!token) return null

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-96'
        }`}>

          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Chat với Admin</h3>
                <p className="text-xs text-gray-300">
                  {conversation?.status === 'active' ? 'Đang hoạt động' : 'Đang chờ'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCloseChat}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 h-64 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Bắt đầu cuộc trò chuyện</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Admin sẽ trả lời trong vài phút
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.senderModel === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg text-sm ${
                            msg.senderModel === 'user'
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-900 border'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderModel === 'user' ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWidget
