import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './screens/SignUp'
import Login from './screens/Login'
import Home from './screens/Home'
import { useAuth } from './context/AuthContext'

function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Home /> : <Navigate to="/signup" />} 
        />
        <Route 
          path="/signup" 
          element={!token ? <Signup /> : <Navigate to="/" />} 
        />
        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/" />} 
        />
      </Routes>
    </>
  )
}

export default App
