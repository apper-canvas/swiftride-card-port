import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ChatInterface from '@/components/organisms/ChatInterface'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { messageService } from '@/services/api/messageService'
import { rideService } from '@/services/api/rideService'
import { driverService } from '@/services/api/driverService'

const MessagingPage = () => {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [ride, setRide] = useState(null)
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (rideId) {
      loadMessages()
      loadRideDetails()
    }
  }, [rideId])

  const loadMessages = async () => {
    try {
      const data = await messageService.getByRideId(parseInt(rideId))
      setMessages(data)
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const loadRideDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const rideData = await rideService.getById(parseInt(rideId))
      setRide(rideData)

      if (rideData.driverId) {
        const driverData = await driverService.getById(rideData.driverId)
        setDriver(driverData)
      }
    } catch (err) {
      setError('Failed to load ride details')
      console.error('Error loading ride details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (text) => {
    try {
      const newMessage = {
        rideId: parseInt(rideId),
        senderId: 'user',
        text,
        timestamp: new Date().toISOString()
      }

      const savedMessage = await messageService.create(newMessage)
      setMessages([...messages, savedMessage])

      // Simulate driver response after a delay
      setTimeout(async () => {
        const driverResponse = {
          rideId: parseInt(rideId),
          senderId: 'driver',
          text: getDriverResponse(text),
          timestamp: new Date().toISOString()
        }

        const driverMessage = await messageService.create(driverResponse)
        setMessages(prev => [...prev, driverMessage])
      }, 1000 + Math.random() * 2000) // Random delay 1-3 seconds

    } catch (error) {
      toast.error('Failed to send message')
      console.error('Error sending message:', error)
    }
  }

  const getDriverResponse = (userMessage) => {
    const responses = [
      "On my way! ETA 3 minutes.",
      "I can see you! I'm in the blue sedan.",
      "Thanks for waiting! Almost there.",
      "Arrived at pickup location.",
      "Sure thing! No problem.",
      "Got it, see you soon!",
      "Thanks for the heads up!"
    ]
    
    if (userMessage.toLowerCase().includes('here')) {
      return "Perfect! I can see you now. I'm pulling up."
    }
    if (userMessage.toLowerCase().includes('late')) {
      return "No worries! Take your time, I'll wait for you."
    }
    if (userMessage.toLowerCase().includes('thanks')) {
      return "You're welcome! Happy to help."
    }
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white shadow-lg">
          <div className="px-4 py-4 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/active-ride')}
              className="mr-3"
            />
            <h1 className="text-xl font-bold text-gray-900 font-display">
              Messages
            </h1>
          </div>
        </div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white shadow-lg">
          <div className="px-4 py-4 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/active-ride')}
              className="mr-3"
            />
            <h1 className="text-xl font-bold text-gray-900 font-display">
              Messages
            </h1>
          </div>
        </div>
        <Error message={error} onRetry={loadRideDetails} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/active-ride')}
              className="mr-3"
            />
            
            {driver ? (
              <div className="flex items-center space-x-3">
                <img
                  src={driver.photo || '/placeholder-avatar.jpg'}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=5856D6&color=fff&size=40`
                  }}
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-900 font-display">
                    {driver.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {driver.vehicle?.make} {driver.vehicle?.model}
                  </p>
                </div>
              </div>
            ) : (
              <h1 className="text-lg font-bold text-gray-900 font-display">
                Driver Chat
              </h1>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon="Phone"
            onClick={() => toast.info('Calling driver...')}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          rideId={rideId}
          messages={messages}
          onSendMessage={handleSendMessage}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default MessagingPage