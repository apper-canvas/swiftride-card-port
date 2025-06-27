import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const LocationInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Enter location",
  icon = "MapPin",
  suggestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState(value?.address || '')

  useEffect(() => {
    setInputValue(value?.address || '')
  }, [value])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setShowSuggestions(true)
    
    // Simulate search
    if (onChange) {
      onChange({
        address: newValue,
        lat: 0,
        lng: 0
      })
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.address)
    setShowSuggestions(false)
    if (onChange) {
      onChange(suggestion)
    }
  }

  return (
    <div className="relative">
      <Input
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        icon={icon}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && inputValue && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions
            .filter(s => s.address.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, 5)
            .map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-surface flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
              >
                <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{suggestion.address}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.lat?.toFixed(4)}, {suggestion.lng?.toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default LocationInput