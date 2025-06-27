import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MapView from '@/components/organisms/MapView'
import DriverCard from '@/components/molecules/DriverCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { rideService } from '@/services/api/rideService'
import { driverService } from '@/services/api/driverService'

const ActiveRidePage = () => {
  const navigate = useNavigate()
  const [activeRide, setActiveRide] = useState(null)
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadActiveRide()
    const interval = setInterval(loadActiveRide, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadActiveRide = async () => {
    if (!loading) return // Prevent multiple simultaneous calls
    
    setError('')
    try {
      const rides = await rideService.getAll()
      const active = rides.find(ride => 
        ['searching_driver', 'driver_assigned', 'in_progress'].includes(ride.status)
      )

      if (!active) {
        setActiveRide(null)
        setDriver(null)
        return
      }

      setActiveRide(active)

      if (active.driverId) {
        const driverData = await driverService.getById(active.driverId)
        setDriver(driverData)
      }
    } catch (err) {
      setError('Failed to load ride details')
      console.error('Error loading active ride:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRide = async () => {
    if (!activeRide) return

    try {
      await rideService.update(activeRide.Id, { status: 'cancelled' })
      toast.success('Ride cancelled successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to cancel ride')
      console.error('Error cancelling ride:', error)
    }
  }

  const handleCompleteRide = async () => {
    if (!activeRide) return

    try {
      await rideService.update(activeRide.Id, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      })
      toast.success('Ride completed! Rate your driver.')
      navigate('/history')
    } catch (error) {
      toast.error('Failed to complete ride')
      console.error('Error completing ride:', error)
    }
  }

  const handleMessage = () => {
    if (activeRide) {
      navigate(`/messages/${activeRide.Id}`)
    }
  }

  const handleCall = () => {
    toast.info('Calling driver...')
  }

  if (loading) {
    return <Loading type="map" />
  }

  if (error) {
    return <Error message={error} onRetry={() => {
      setLoading(true)
      loadActiveRide()
    }} />
  }

  if (!activeRide) {
    return (
      <Empty
        title="No Active Ride"
        description="You don't have any active rides. Book a ride to get started!"
        actionText="Book a Ride"
        onAction={() => navigate('/')}
        icon="Car"
      />
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">
              Your Ride
            </h1>
            <p className="text-sm text-gray-600 capitalize">
              {activeRide.status.replace('_', ' ')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="MessageCircle"
              onClick={handleMessage}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Phone"
              onClick={handleCall}
            />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <MapView
          pickupLocation={activeRide.pickupLocation}
          dropoffLocation={activeRide.dropoffLocation}
          driverLocation={driver?.location}
          showRoute={true}
          className="h-full"
        />

        {/* Status Bar */}
        <div className="absolute top-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-success-400 to-success-600 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900 capitalize">
                  {activeRide.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ${activeRide.fare?.toFixed(2) || '12.50'}
                </div>
                <div className="text-sm text-gray-600">
                  {activeRide.distance?.toFixed(1) || '2.1'} miles
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Driver Card */}
        {driver && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <DriverCard
              driver={driver}
              ride={{
                ...activeRide,
                eta: Math.floor(Math.random() * 5) + 2 // Simulate ETA
              }}
              onMessage={handleMessage}
              onCall={handleCall}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex space-x-3 mb-4">
            {activeRide.status !== 'completed' && (
              <Button
                variant="secondary"
                onClick={handleCancelRide}
                className="flex-1"
                icon="X"
              >
                Cancel Ride
              </Button>
            )}
            
            {activeRide.status === 'in_progress' && (
              <Button
                onClick={handleCompleteRide}
                className="flex-1"
                icon="Check"
              >
                Complete Ride
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveRidePage