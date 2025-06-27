export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const estimateDuration = (distance) => {
  // Estimate duration based on average city speed (25 mph)
  const averageSpeed = 25
  const hours = distance / averageSpeed
  return Math.ceil(hours * 60) // Convert to minutes
}

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export const reverseGeocode = async (lat, lng) => {
  // Simulate reverse geocoding
  const addresses = [
    "123 Main Street, City",
    "456 Oak Avenue, Downtown",
    "789 Pine Boulevard, Uptown",
    "321 Elm Drive, Westside"
  ]
  
  return addresses[Math.floor(Math.random() * addresses.length)]
}

export const searchPlaces = async (query) => {
  // Simulate place search
  const places = [
    { name: "Central Park", address: "Central Park, Manhattan, NY", lat: 40.7829, lng: -73.9654 },
    { name: "Times Square", address: "Times Square, Manhattan, NY", lat: 40.7580, lng: -73.9855 },
    { name: "Brooklyn Bridge", address: "Brooklyn Bridge, NY", lat: 40.7061, lng: -73.9969 },
    { name: "Empire State Building", address: "Empire State Building, Manhattan, NY", lat: 40.7484, lng: -73.9857 }
  ]
  
  return places.filter(place => 
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase())
  )
}