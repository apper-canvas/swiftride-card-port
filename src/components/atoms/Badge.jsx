const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800',
    success: 'bg-gradient-to-r from-success-100 to-success-200 text-success-800',
    warning: 'bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800',
    error: 'bg-gradient-to-r from-error-100 to-error-200 text-error-800',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge