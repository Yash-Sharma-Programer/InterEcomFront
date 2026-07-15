import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SiteMeta from "./components/SiteMeta"
import AdminLayout from "./components/admin/AdminLayout"
import AdminRoute from "./components/admin/AdminRoute"

// Public / customer pages
import Home from "./Pages/Home"
import Shop from "./Pages/Shop"
import ProductDetail from "./Pages/ProductDetail"
import CategoryPage from "./Pages/CategoryPage"
import LogIn from "./Pages/LogIn"
import ForgotPassword from "./Pages/ForgotPassword"
import ResetPassword from "./Pages/ResetPassword"
import ChangePassword from "./Pages/ChangePassword"
import SignIn from "./Pages/SigIn"
import Profile from "./Pages/Profile"
import MyOrders from "./Pages/MyOrders"
import OrderDetail from "./Pages/OrderDetail"
import Checkout from "./Pages/Checkout"
import Wishlist from "./Pages/Wishlist"
import PageView from "./Pages/PageView"

// Admin pages
import AdminLogin from "./Pages/AdminLogin"
import AdminDashboardHome from "./Pages/admin/AdminDashboardHome"
import AdminProducts from "./Pages/admin/AdminProducts"
import ProductForm from "./Pages/admin/ProductForm"
import AdminCategories from "./Pages/admin/AdminCategories"
import AdminOrders from "./Pages/admin/AdminOrders"
import AdminOrderDetail from "./Pages/admin/AdminOrderDetail"
import AdminUsers from "./Pages/admin/AdminUsers"
import AdminUserDetail from "./Pages/admin/AdminUserDetail"
import AdminReviews from "./Pages/admin/AdminReviews"
import AdminPages from "./Pages/admin/AdminPages"
import AdminMenus from "./Pages/admin/AdminMenus"
import AdminSiteSettings from "./Pages/admin/AdminSiteSettings"

// Layout that shows the storefront Navbar above customer-facing pages
const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-300/35 blur-3xl">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SiteMeta />
            <BrowserRouter>
              <Routes>
                {/* Admin auth (no navbar / no sidebar) */}
                <Route path="/adminlogin" element={<AdminLogin />} />

                {/* Admin panel (sidebar layout, guarded) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboardHome />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:id" element={<AdminUserDetail />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="pages" element={<AdminPages />} />
                  <Route path="menus" element={<AdminMenus />} />
                  <Route path="settings" element={<AdminSiteSettings />} />
                </Route>

                {/* Storefront (navbar layout) */}
                <Route element={<LayoutWithNavbar />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/my-orders/:id" element={<OrderDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/page/:slug" element={<PageView />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer position="top-center" autoClose={2500} hideProgressBar newestOnTop />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  )
}

export default App
