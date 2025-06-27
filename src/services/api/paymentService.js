import mockPayments from '@/services/mockData/payments.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PaymentService {
  constructor() {
    this.payments = [...mockPayments]
  }

  async getAll() {
    await delay(300)
    return [...this.payments]
  }

  async getById(id) {
    await delay(200)
    const payment = this.payments.find(p => p.Id === id)
    if (!payment) {
      throw new Error('Payment method not found')
    }
    return { ...payment }
  }

  async create(paymentData) {
    await delay(400)
    
    // If this is set as default, make all others non-default
    if (paymentData.isDefault) {
      this.payments.forEach(p => p.isDefault = false)
    }
    
    const newPayment = {
      Id: Math.max(...this.payments.map(p => p.Id), 0) + 1,
      ...paymentData
    }

    this.payments.push(newPayment)
    return { ...newPayment }
  }

  async update(id, updateData) {
    await delay(300)
    
    const index = this.payments.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Payment method not found')
    }

    // If this is being set as default, make all others non-default
    if (updateData.isDefault) {
      this.payments.forEach(p => p.isDefault = false)
    }

    this.payments[index] = { ...this.payments[index], ...updateData }
    return { ...this.payments[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.payments.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Payment method not found')
    }

    const deletedPayment = this.payments.splice(index, 1)[0]
    return { ...deletedPayment }
  }
}

export const paymentService = new PaymentService()