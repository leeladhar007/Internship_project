import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Upload from './pages/Upload'
import Chat from './pages/Chat'
import Feedback from './pages/Feedback'

// FIX: the outer <AnimatePresence mode="wait"> around <Routes> did nothing -
// AppLayout.jsx already has its own AnimatePresence wrapping a keyed
// motion.div around <Outlet/>, which is what actually animates route
// transitions. This outer one wrapped plain <Route> elements (not motion
// components, no `exit` animation defined), so it was inert weight and, on
// some route-tree shapes, a source of "AnimatePresence expects a single
// child" console warnings. Removed - transitions still work via AppLayout.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/about" replace />} />
            <Route path="about" element={<About />} />
            <Route path="upload" element={<Upload />} />
            <Route path="chat" element={<Chat />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}