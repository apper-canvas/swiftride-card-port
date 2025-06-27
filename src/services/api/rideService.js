import mockRides from '@/services/mockData/rides.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class RideService {
  constructor() {
    this.rides = [...mockRides]
  }

  async getAll() {
    await delay(300)
    return [...this.rides]
  }

  async getById(id) {
    await delay(200)
    const ride = this.rides.find(r => r.Id === id)
    if (!ride) {
      throw new Error('Ride not found')
    }
    return { ...ride }
  }

  async create(rideData) {
    await delay(400)
    
    const newRide = {
      Id: Math.max(...this.rides.map(r => r.Id), 0) + 1,
      userId: "user123",
      driverId: null,
      status: rideData.status || "searching_driver",
      pickupLocation: rideData.pickupLocation,
      dropoffLocation: rideData.dropoffLocation,
      rideType: rideData.rideType,
      fare: this.calculateFare(rideData.rideType),
      distance: Math.random() * 10 + 1,
      duration: Math.floor(Math.random() * 30) + 10,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    // Simulate driver assignment after a short delay
    setTimeout(() => {
      const driverIds = [1, 2, 3, 4, 5]
      newRide.driverId = driverIds[Math.floor(Math.random() * driverIds.length)]
      newRide.status = "driver_assigned"
      
      // Update the ride in the array
      const index = this.rides.findIndex(r => r.Id === newRide.Id)
      if (index !== -1) {
        this.rides[index] = newRide
      }
    }, 3000)

    this.rides.push(newRide)
    return { ...newRide }
  }

  async update(id, updateData) {
    await delay(300)
    
    const index = this.rides.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Ride not found')
    }

    this.rides[index] = { ...this.rides[index], ...updateData }
    return { ...this.rides[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.rides.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Ride not found')
    }

    const deletedRide = this.rides.splice(index, 1)[0]
    return { ...deletedRide }
  }

  calculateFare(rideType) {
    const baseFares = {
      standard: 12,
      premium: 18,
      carpool: 8
    }
    
    const baseFare = baseFares[rideType] || baseFares.standard
    const surge = 1 + (Math.random() * 0.5) // 0-50% surge
    return Math.round(baseFare * surge * 100) / 100
  }
}

export const rideService = new RideService()