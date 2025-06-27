import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import React from "react";

const PaymentMethodCard = ({ 
  payment, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const getCardIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return 'CreditCard'
      case 'mastercard':
        return 'CreditCard'
      case 'american express':
        return 'CreditCard'
      default:
        return 'CreditCard'
    }
  }

  const getCardColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return 'from-blue-500 to-blue-600'
      case 'mastercard':
        return 'from-red-500 to-red-600'
      case 'american express':
        return 'from-green-500 to-green-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
    whileHover={{
        scale: 1.02
    }}
    whileTap={{
        scale: 0.98
    }}
    onClick={onSelect}
    className={`
        card p-4 cursor-pointer transition-all duration-200
        ${isSelected ? "ring-2 ring-primary-500 shadow-lg bg-gradient-to-r from-primary-50 to-primary-100" : "hover:shadow-lg"}
        ${className}
      `}>
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div
                className={`
            w-12 h-8 rounded-lg bg-gradient-to-r ${getCardColor(payment.cardType)} 
            flex items-center justify-center shadow-lg
          `}>
                <ApperIcon name={getCardIcon(payment.cardType)} className="w-5 h-5 text-white" />
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">•••• •••• •••• {payment.last4}
                    </span>
                    {payment.isDefault && <Badge variant="primary" size="sm">Default</Badge>}
                </div>
                <p className="text-sm text-gray-600 capitalize">
                    {payment.cardType}• Expires {payment.expiryMonth}/{payment.expiryYear}
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            {isSelected && <div
                className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Check" className="w-4 h-4 text-white" />
            </div>}
            <div className="flex space-x-1">
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        onEdit && onEdit(payment);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                </motion.button>
                {!payment.isDefault && <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        onDelete && onDelete(payment.Id);
                    }}
                    className="p-2 text-gray-400 hover:text-error-500 transition-colors">
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                </motion.button>}
            </div>
        </div>
    </div>
</motion.div>
  )
}

export default PaymentMethodCard