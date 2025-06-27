import mockDrivers from '@/services/mockData/drivers.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DriverService {
  constructor() {
    this.drivers = [...mockDrivers]
  }

  async getAll() {
    await delay(300)
    return [...this.drivers]
  }

  async getById(id) {
    await delay(200)
    const driver = this.drivers.find(d => d.Id === id)
    if (!driver) {
      throw new Error('Driver not found')
    }
    return { ...driver }
  }

  async create(driverData) {
    await delay(400)
    
    const newDriver = {
      Id: Math.max(...this.drivers.map(d => d.Id), 0) + 1,
      ...driverData,
      isActive: true,
      location: driverData.location || {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      }
    }

    this.drivers.push(newDriver)
    return { ...newDriver }
  }

  async update(id, updateData) {
    await delay(300)
    
    const index = this.drivers.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Driver not found')
    }

    this.drivers[index] = { ...this.drivers[index], ...updateData }
    return { ...this.drivers[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.drivers.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Driver not found')
    }

    const deletedDriver = this.drivers.splice(index, 1)[0]
    return { ...deletedDriver }
  }
}

export const driverService = new DriverService()