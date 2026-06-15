import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Product from './components/Product'
import SignIn from './Pages/SigIn'
import LogIn from './Pages/LogIn'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import AddProduct from './Pages/AddProduct'
import Profile from './Pages/Profile'

function App() {
  return (
    <>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes - no Navbar */}
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Main app routes - with Navbar */}
            <Route path="/" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/addproduct" element={<AddProduct />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={
                    <>
                      <Header />
                      <Product />
                    </>
                  } />
                </Routes>
              </>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
            </>
  )
}

export default App
