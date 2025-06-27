import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: 'Car', label: 'Book' },
    { path: '/active-ride', icon: 'Navigation', label: 'Active' },
    { path: '/history', icon: 'Clock', label: 'History' },
    { path: '/payment', icon: 'CreditCard', label: 'Payment' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center py-2 px-4 min-w-0 flex-1
                ${isActive ? 'text-primary-500' : 'text-gray-500'}
              `}
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`
                    p-2 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-br from-primary-100 to-primary-200' 
                      : 'hover:bg-gray-100'
                    }
                  `}>
                    <ApperIcon 
                      name={item.icon} 
                      className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-500'}`} 
                    />
                  </div>
                  <span className={`
                    text-xs font-medium
                    ${isActive ? 'text-primary-500' : 'text-gray-500'}
                  `}>
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation