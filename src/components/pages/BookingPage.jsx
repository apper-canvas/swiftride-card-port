import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MapView from '@/components/organisms/MapView'
import BookingForm from '@/components/organisms/BookingForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { rideService } from '@/services/api/rideService'

const BookingPage = () => {
  const navigate = useNavigate()
  const [currentRide, setCurrentRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkActiveRide()
  }, [])

  const checkActiveRide = async () => {
    setLoading(true)
    setError('')
    try {
      const rides = await rideService.getAll()
      const activeRide = rides.find(ride => 
        ['searching_driver', 'driver_assigned', 'in_progress'].includes(ride.status)
      )
      
      if (activeRide) {
        navigate('/active-ride')
        return
      }
    } catch (err) {
      setError('Failed to check active rides')
      console.error('Error checking active ride:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRideBooked = (ride) => {
    setCurrentRide(ride)
    navigate('/active-ride')
  }

  if (loading) {
    return <Loading type="map" />
  }

  if (error) {
    return <Error message={error} onRetry={checkActiveRide} />
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg z-10">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Book Your Ride
          </h1>
          <p className="text-gray-600 mt-1">
            Get where you need to go, fast and reliable
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <MapView className="h-full" />
        
        {/* Booking Form Overlay */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <BookingForm onRideBooked={handleRideBooked} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingPage