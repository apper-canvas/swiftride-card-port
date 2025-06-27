import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const DriverCard = ({ driver, ride, onMessage, onCall, className = '' }) => {
  if (!driver) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ${className}`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={driver.photo || '/placeholder-avatar.jpg'}
            alt={driver.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=5856D6&color=fff&size=64`
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900">{driver.name}</h3>
            <Badge variant="primary" size="sm">
              <ApperIcon name="Star" className="w-3 h-3 mr-1" />
              {driver.rating.toFixed(1)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {driver.vehicle?.make} {driver.vehicle?.model} • {driver.vehicle?.color}
          </p>
          <p className="text-sm font-medium text-gray-800">
            {driver.vehicle?.licensePlate}
          </p>
        </div>
      </div>

      {ride && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-800">ETA: {ride.eta} min</span>
            </div>
            <Badge variant="primary" size="sm">{ride.status}</Badge>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-start space-x-2">
              <ApperIcon name="MapPin" className="w-4 h-4 text-success-500 mt-0.5" />
              <span>{ride.pickupLocation?.address}</span>
            </div>
            <div className="flex items-start space-x-2">
              <ApperIcon name="Flag" className="w-4 h-4 text-error-500 mt-0.5" />
              <span>{ride.dropoffLocation?.address}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMessage}
          className="flex-1 btn-secondary py-3"
        >
          <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
          Message
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCall}
          className="flex-1 bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold py-3 px-4 rounded-xl"
        >
          <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
          Call
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DriverCard