import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MapView = ({ 
  pickupLocation, 
  dropoffLocation, 
  driverLocation, 
  showRoute = false,
  className = '' 
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })

  useEffect(() => {
    if (pickupLocation) {
      setMapCenter({ lat: pickupLocation.lat, lng: pickupLocation.lng })
    }
  }, [pickupLocation])

  // Simulate map behavior with a styled container
  return (
    <div className={`relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${className}`}>
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Street lines */}
          <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="100" y1="0" x2="100" y2="300" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="300" y1="0" x2="300" y2="300" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Route line */}
          {showRoute && pickupLocation && dropoffLocation && (
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              x1="150" y1="120" x2="250" y2="180"
              stroke="#5856D6"
              strokeWidth="4"
              strokeDasharray="8,4"
              className="route-line"
            />
          )}
        </svg>
      </div>

      {/* Location Markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Pickup Location */}
        {pickupLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute"
            style={{ left: '35%', top: '40%' }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-success-400 to-success-600 rounded-full shadow-lg flex items-center justify-center animate-pulse-dot">
                <ApperIcon name="MapPin" className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                Pickup
              </div>
            </div>
          </motion.div>
        )}

        {/* Dropoff Location */}
        {dropoffLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute"
            style={{ left: '60%', top: '60%' }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-error-400 to-error-600 rounded-full shadow-lg flex items-center justify-center animate-pulse-dot">
                <ApperIcon name="Flag" className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                Dropoff
              </div>
            </div>
          </motion.div>
        )}

        {/* Driver Location */}
        {driverLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute driver-marker"
            style={{ left: '45%', top: '30%' }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-lg flex items-center justify-center">
                <ApperIcon name="Car" className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                Driver
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
        >
          <ApperIcon name="Minus" className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Current Location Button */}
      <div className="absolute bottom-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
        >
          <ApperIcon name="Navigation" className="w-6 h-6 text-primary-500" />
        </motion.button>
      </div>
    </div>
  )
}

export default MapView