import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import LocationInput from '@/components/molecules/LocationInput'
import RideTypeSelector from '@/components/molecules/RideTypeSelector'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { rideService } from '@/services/api/rideService'
import { locationService } from '@/services/api/locationService'

const BookingForm = ({ onRideBooked, className = '' }) => {
  const [pickupLocation, setPickupLocation] = useState(null)
  const [dropoffLocation, setDropoffLocation] = useState(null)
  const [rideType, setRideType] = useState('standard')
  const [isBooking, setIsBooking] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useState(() => {
    const loadSuggestions = async () => {
      try {
        const data = await locationService.getSuggestions()
        setSuggestions(data)
      } catch (error) {
        console.error('Failed to load location suggestions:', error)
      }
    }
    loadSuggestions()
  }, [])

  const handleBookRide = async () => {
    if (!pickupLocation?.address || !dropoffLocation?.address) {
      toast.error('Please select both pickup and dropoff locations')
      return
    }

    setIsBooking(true)
    try {
      const newRide = {
        pickupLocation,
        dropoffLocation,
        rideType,
        status: 'searching_driver'
      }

      const bookedRide = await rideService.create(newRide)
      toast.success('Ride booked successfully! Searching for driver...')
      
      if (onRideBooked) {
        onRideBooked(bookedRide)
      }
    } catch (error) {
      console.error('Failed to book ride:', error)
      toast.error('Failed to book ride. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  const swapLocations = () => {
    const temp = pickupLocation
    setPickupLocation(dropoffLocation)
    setDropoffLocation(temp)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* Location Inputs */}
      <div className="space-y-4">
        <div className="relative">
          <LocationInput
            label="Pickup Location"
            value={pickupLocation}
            onChange={setPickupLocation}
            placeholder="Where are you?"
            icon="Circle"
            suggestions={suggestions}
          />
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapLocations}
            className="absolute right-4 top-12 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 z-10"
          >
            <ApperIcon name="ArrowUpDown" className="w-4 h-4" />
          </motion.button>
        </div>
        
        <LocationInput
          label="Dropoff Location"
          value={dropoffLocation}
          onChange={setDropoffLocation}
          placeholder="Where to?"
          icon="Flag"
          suggestions={suggestions}
        />
      </div>

      {/* Ride Type Selector */}
      <RideTypeSelector
        selectedType={rideType}
        onSelect={setRideType}
      />

      {/* Book Ride Button */}
      <Button
        onClick={handleBookRide}
        loading={isBooking}
        disabled={!pickupLocation?.address || !dropoffLocation?.address}
        className="w-full"
        size="lg"
      >
        {isBooking ? 'Booking Ride...' : 'Book Ride'}
      </Button>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          size="sm"
          icon="Home"
          className="flex-1"
          onClick={() => {
            setDropoffLocation({
              address: '123 Home Street, City',
              lat: 40.7128,
              lng: -74.0060
            })
          }}
        >
          Home
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon="Building"
          className="flex-1"
          onClick={() => {
            setDropoffLocation({
              address: '456 Work Avenue, City',
              lat: 40.7589,
              lng: -73.9851
            })
          }}
        >
          Work
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon="MapPin"
          className="flex-1"
          onClick={() => {
            // Simulate current location
            setPickupLocation({
              address: 'Current Location',
              lat: 40.7128,
              lng: -74.0060
            })
          }}
        >
          Current
        </Button>
      </div>
    </motion.div>
  )
}

export default BookingForm