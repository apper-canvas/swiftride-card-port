import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import BookingPage from '@/components/pages/BookingPage'
import ActiveRidePage from '@/components/pages/ActiveRidePage'
import HistoryPage from '@/components/pages/HistoryPage'
import PaymentPage from '@/components/pages/PaymentPage'
import MessagingPage from '@/components/pages/MessagingPage'
import BottomNavigation from '@/components/organisms/BottomNavigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/active-ride" element={<ActiveRidePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/messages/:rideId" element={<MessagingPage />} />
          </Routes>
        </main>
        <BottomNavigation />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App