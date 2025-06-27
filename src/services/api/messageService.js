import mockMessages from '@/services/mockData/messages.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MessageService {
  constructor() {
    this.messages = [...mockMessages]
  }

  async getAll() {
    await delay(300)
    return [...this.messages]
  }

  async getById(id) {
    await delay(200)
    const message = this.messages.find(m => m.Id === id)
    if (!message) {
      throw new Error('Message not found')
    }
    return { ...message }
  }

  async getByRideId(rideId) {
    await delay(300)
    return this.messages
      .filter(m => m.rideId === rideId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  async create(messageData) {
    await delay(200)
    
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id), 0) + 1,
      ...messageData
    }

    this.messages.push(newMessage)
    return { ...newMessage }
  }

  async update(id, updateData) {
    await delay(300)
    
    const index = this.messages.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Message not found')
    }

    this.messages[index] = { ...this.messages[index], ...updateData }
    return { ...this.messages[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.messages.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Message not found')
    }

    const deletedMessage = this.messages.splice(index, 1)[0]
    return { ...deletedMessage }
  }
}

export const messageService = new MessageService()