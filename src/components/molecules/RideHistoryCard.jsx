import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const RideHistoryCard = ({ ride, onRate, onViewReceipt, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'error'
      case 'in_progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy • h:mm a')
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`card p-4 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant={getStatusColor(ride.status)} size="sm">
              {ride.status?.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(ride.completedAt || ride.createdAt)}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            ${ride.fare?.toFixed(2)}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">{ride.rideType}</div>
          <div className="text-sm font-medium text-gray-700">
            {ride.distance?.toFixed(1)} miles • {ride.duration} min
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Pickup</div>
            <div className="text-sm text-gray-600">{ride.pickupLocation?.address}</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-error-500 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Dropoff</div>
            <div className="text-sm text-gray-600">{ride.dropoffLocation?.address}</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {ride.status === 'completed' && !ride.rated && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRate && onRate(ride)}
            className="flex-1 btn-primary py-2 text-sm"
          >
            <ApperIcon name="Star" className="w-4 h-4 mr-2" />
            Rate Ride
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewReceipt && onViewReceipt(ride)}
          className="flex-1 btn-secondary py-2 text-sm"
        >
          <ApperIcon name="Receipt" className="w-4 h-4 mr-2" />
          Receipt
        </motion.button>
      </div>
    </motion.div>
  )
}

export default RideHistoryCard