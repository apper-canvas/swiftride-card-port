import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const ChatInterface = ({ rideId, messages = [], onSendMessage, className = '' }) => {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      await onSendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'h:mm a')
    } catch (error) {
      return ''
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[75%] rounded-2xl px-4 py-3 shadow-sm
                ${message.senderId === 'user'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
                }
              `}>
                <p className="text-sm">{message.text}</p>
                <p className={`
                  text-xs mt-1 opacity-75
                  ${message.senderId === 'user' ? 'text-primary-100' : 'text-gray-500'}
                `}>
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="mb-0"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            loading={isSending}
            disabled={!newMessage.trim()}
            className="px-4"
          >
            <ApperIcon name="Send" className="w-4 h-4" />
          </Button>
        </div>
{/* Quick Messages */}
        <div className="flex space-x-2 mt-3">
          {["I'm here", "Running late", "Thanks!"].map((quickMsg) => (
            <motion.button
              key={quickMsg}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setNewMessage(quickMsg)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {quickMsg}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatInterface