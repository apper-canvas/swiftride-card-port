import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const RideTypeSelector = ({ selectedType, onSelect, className = '' }) => {
  const rideTypes = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Affordable rides',
      icon: 'Car',
      price: '$12-15',
      eta: '3-5 min'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Luxury vehicles',
      icon: 'Crown',
      price: '$18-22',
      eta: '5-8 min'
    },
    {
      id: 'carpool',
      name: 'Carpool',
      description: 'Share & save',
      icon: 'Users',
      price: '$8-12',
      eta: '8-12 min'
    }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900">Choose your ride</h3>
      <div className="space-y-2">
        {rideTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(type.id)}
            className={`
              w-full p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selectedType === type.id 
                ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedType === type.id 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  <ApperIcon name={type.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{type.price}</div>
                <div className="text-sm text-gray-500">{type.eta}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default RideTypeSelector