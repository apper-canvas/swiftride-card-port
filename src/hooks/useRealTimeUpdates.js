import { useState, useEffect, useRef } from 'react'

export const useRealTimeUpdates = (updateFunction, interval = 5000, dependencies = []) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const performUpdate = async () => {
      if (!mountedRef.current || isUpdating) return
      
      setIsUpdating(true)
      try {
        await updateFunction()
      } catch (error) {
        console.error('Real-time update failed:', error)
      } finally {
        if (mountedRef.current) {
          setIsUpdating(false)
        }
      }
    }

    // Initial update
    performUpdate()

    // Set up interval for subsequent updates
    intervalRef.current = setInterval(performUpdate, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [...dependencies, interval])

  const stopUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startUpdates = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(updateFunction, interval)
    }
  }

  return { isUpdating, stopUpdates, startUpdates }
}