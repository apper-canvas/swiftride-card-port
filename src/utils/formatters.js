import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} ft`
  }
  return `${distance.toFixed(1)} mi`
}

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export const formatRideDate = (dateString) => {
  try {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    }
    
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    }
    
    return format(date, 'MMM dd, yyyy • h:mm a')
  } catch (error) {
    return 'Invalid date'
  }
}

export const formatTimeAgo = (dateString) => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return 'Unknown time'
  }
}

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export const formatCardNumber = (cardNumber) => {
  return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
}

export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (cleaned.length < 4) return cardNumber
  return `•••• •••• •••• ${cleaned.slice(-4)}`
}