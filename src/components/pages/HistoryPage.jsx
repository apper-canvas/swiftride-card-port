import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RideHistoryCard from "@/components/molecules/RideHistoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { rideService } from "@/services/api/rideService";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  useEffect(() => {
    loadRideHistory()
  }, [])

  const loadRideHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await rideService.getAll()
      // Only show completed or cancelled rides in history
      const historyRides = data.filter(ride => 
        ['completed', 'cancelled'].includes(ride.status)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setRides(historyRides)
    } catch (err) {
      setError('Failed to load ride history')
      console.error('Error loading ride history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRateRide = (ride) => {
    toast.info('Rating feature coming soon!')
  }

  const handleViewReceipt = (ride) => {
    toast.info('Receipt feature coming soon!')
  }

  const filterOptions = [
    { value: 'all', label: 'All Rides' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const filteredRides = rides.filter(ride => 
    filter === 'all' || ride.status === filter
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              Ride History
            </h1>
          </div>
        </div>
        <Loading type="list" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              Ride History
            </h1>
          </div>
        </div>
        <Error message={error} onRetry={loadRideHistory} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                Ride History
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredRides.length} rides
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Download"
              onClick={() => toast.info('Export feature coming soon!')}
            >
              Export
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(option.value)}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200
                  ${filter === option.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredRides.length === 0 ? (
          <Empty
            title="No rides yet"
            description="Your ride history will appear here once you complete your first ride."
            actionText="Book Your First Ride"
            onAction={() => navigate('/')}
            icon="Clock"
          />
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RideHistoryCard
                  ride={ride}
                  onRate={handleRateRide}
                  onViewReceipt={handleViewReceipt}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage