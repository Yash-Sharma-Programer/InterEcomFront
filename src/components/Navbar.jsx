import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'

const Navbar = () => {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(location.search)
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    navigate(`/?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setSearch('')
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight shrink-0">
            🛍 ShopEase
          </NavLink>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
            <div className="flex w-full border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              )}
              <button type="submit" className="bg-indigo-600 text-white px-4 text-sm hover:bg-indigo-700 transition">
                Search
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-sm text-red-500 hover:text-red-600 font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signin"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                  Sign Up
                </NavLink>
              </>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-100 transition font-medium text-sm"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Navbar
