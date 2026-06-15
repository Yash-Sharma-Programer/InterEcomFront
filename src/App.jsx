import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"

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