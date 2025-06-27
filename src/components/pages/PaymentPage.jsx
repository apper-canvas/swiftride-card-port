import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PaymentMethodCard from '@/components/molecules/PaymentMethodCard'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { paymentService } from '@/services/api/paymentService'

const PaymentPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addingPayment, setAddingPayment] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  })

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await paymentService.getAll()
      setPaymentMethods(data)
      
      const defaultPayment = data.find(p => p.isDefault)
      if (defaultPayment) {
        setSelectedPayment(defaultPayment.Id)
      }
    } catch (err) {
      setError('Failed to load payment methods')
      console.error('Error loading payment methods:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!newCard.cardNumber || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      toast.error('Please fill in all card details')
      return
    }

    setAddingPayment(true)
    try {
      const cardData = {
        last4: newCard.cardNumber.slice(-4),
        cardType: getCardType(newCard.cardNumber),
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        cardholderName: newCard.cardholderName,
        isDefault: paymentMethods.length === 0 || newCard.isDefault
      }

      const newPayment = await paymentService.create(cardData)
      setPaymentMethods([...paymentMethods, newPayment])
      
      if (newPayment.isDefault) {
        setSelectedPayment(newPayment.Id)
      }
      
      setShowAddForm(false)
      setNewCard({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
      })
      
      toast.success('Payment method added successfully!')
    } catch (error) {
      toast.error('Failed to add payment method')
      console.error('Error adding payment method:', error)
    } finally {
      setAddingPayment(false)
    }
  }

  const handleDeletePayment = async (paymentId) => {
    try {
      await paymentService.delete(paymentId)
      const updatedMethods = paymentMethods.filter(p => p.Id !== paymentId)
      setPaymentMethods(updatedMethods)
      
      if (selectedPayment === paymentId) {
        const newDefault = updatedMethods.find(p => p.isDefault)
        setSelectedPayment(newDefault?.Id || null)
      }
      
      toast.success('Payment method removed')
    } catch (error) {
      toast.error('Failed to remove payment method')
      console.error('Error deleting payment method:', error)
    }
  }

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5')) return 'Mastercard'
    if (number.startsWith('3')) return 'American Express'
    return 'Unknown'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              Payment Methods
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
              Payment Methods
            </h1>
          </div>
        </div>
        <Error message={error} onRetry={loadPaymentMethods} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                Payment Methods
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your payment options
              </p>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={() => setShowAddForm(true)}
            >
              Add Card
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {paymentMethods.length === 0 && !showAddForm ? (
          <Empty
            title="No payment methods"
            description="Add a payment method to start booking rides seamlessly."
            actionText="Add Payment Method"
            onAction={() => setShowAddForm(true)}
            icon="CreditCard"
          />
        ) : (
          <>
            {/* Payment Methods List */}
            <div className="space-y-4 mb-6">
              {paymentMethods.map((payment) => (
                <PaymentMethodCard
                  key={payment.Id}
                  payment={payment}
                  isSelected={selectedPayment === payment.Id}
                  onSelect={() => setSelectedPayment(payment.Id)}
                  onDelete={handleDeletePayment}
                />
              ))}
            </div>

            {/* Selected Payment Summary */}
            {selectedPayment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 mb-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="Check" className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Default Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      This card will be used for your rides
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Add Payment Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Card</h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowAddForm(false)}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Card Number"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                icon="CreditCard"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Month"
                  value={newCard.expiryMonth}
                  onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                  placeholder="MM"
                />
                <Input
                  label="Expiry Year"
                  value={newCard.expiryYear}
                  onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                  placeholder="YY"
                />
              </div>

              <Input
                label="CVV"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                placeholder="123"
                icon="Shield"
              />

              <Input
                label="Cardholder Name"
                value={newCard.cardholderName}
                onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                placeholder="John Doe"
                icon="User"
              />

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newCard.isDefault}
                  onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  Set as default payment method
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPayment}
                  loading={addingPayment}
                  className="flex-1"
                >
                  Add Card
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PaymentPage