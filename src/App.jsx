import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import Navbar from "./components/Navbar"
import Header from "./components/Header"
import Product from "./components/Product"
import LogIn from "./Pages/LogIn"
import SignIn from "./Pages/SigIn"
import AddProduct from "./Pages/AddProduct"
import Profile from "./Pages/Profile"
import MyOrders from "./Pages/MyOrders"
import Checkout from "./Pages/Checkout"
import AdminLogin from "./Pages/AdminLogin"
import AdminDashboard from "./Pages/AdminDashboard"

// Ek Layout component jo baki pages ke upar Navbar dikhayega
const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Baaki ke pages yahan render honge */}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Admin Routes - Inme Navbar nahi dikhega */}
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 2. Main Routes - In sabhi pages par Navbar sath mein dikhega */}
            <Route element={<LayoutWithNavbar />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/" element={
                <>
                  <Header />
                  <Product />
                </>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
