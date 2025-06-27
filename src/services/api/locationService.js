import mockLocations from '@/services/mockData/locations.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class LocationService {
  constructor() {
    this.locations = [...mockLocations]
  }

  async getSuggestions() {
    await delay(200)
    return [...this.locations]
  }

  async searchLocations(query) {
    await delay(300)
    return this.locations.filter(location =>
      location.address.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getCurrentLocation() {
    await delay(500)
    // Simulate getting current location
    return {
      address: "Current Location",
      lat: 40.7128 + (Math.random() - 0.5) * 0.01,
      lng: -74.0060 + (Math.random() - 0.5) * 0.01
    }
  }
}

export const locationService = new LocationService()