import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { siteSettingsApi } from '../api/siteSettings.api'
import { menuApi } from '../api/menu.api'
import CartDrawer from './CartDrawer'

const Navbar = () => {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [headerMenu, setHeaderMenu] = useState(null)

  useEffect(() => {
    siteSettingsApi.get().then(res => { if (res.data.success) setSettings(res.data.settings) }).catch(() => {})
    menuApi.getByLocation('header').then(res => { if (res.data.success) setHeaderMenu(res.data.menu) }).catch(() => {})
  }, [])

  const siteName = settings?.siteName || 'ShopZen'
  const headerItems = headerMenu?.items?.length
    ? [...headerMenu.items].sort((a, b) => a.order - b.order)
    : []

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    navigate(`/shop?${params.toString()}`)
    setMobileMenuOpen(false)
  }

  const handleClearSearch = () => {
    setSearch('')
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-indigo-600 tracking-tight shrink-0">
            {settings?.logo ? (
              <img src={settings.logo} alt={siteName} className="h-7 sm:h-8 w-auto object-contain" />
            ) : (
              <span>🛍</span>
            )}
            {siteName}
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-indigo-600' : 'hover:text-indigo-600 transition'}>Shop</NavLink>
            {headerItems.map(item => (
              <a
                key={item._id}
                href={item.url}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                className="hover:text-indigo-600 transition"
              >
                {item.label}
              </a>
            ))}
          </div>

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

          {/* Right side - desktop */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <NavLink to="/wishlist" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition" title="Wishlist">
                  ♡
                </NavLink>
                <NavLink to="/my-orders" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                  My Orders
                </NavLink>
                <NavLink to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </NavLink>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                  Login
                </NavLink>
                <NavLink to="/signin" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium">
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

          {/* Mobile right side: cart + hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-2 rounded-xl hover:bg-indigo-100 transition font-medium text-sm"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 px-4 py-4 space-y-4 bg-white">
            <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 text-sm hover:bg-indigo-700 transition">
                Go
              </button>
            </form>

            <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">Shop</NavLink>
            {headerItems.map(item => (
              <a
                key={item._id}
                href={item.url}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700"
              >
                {item.label}
              </a>
            ))}

            {user ? (
              <>
                <NavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">Wishlist</NavLink>
                <NavLink to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">My Orders</NavLink>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                  {user.name} (Profile)
                </NavLink>
                <button onClick={handleLogout} className="block text-sm text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <div className="flex gap-3">
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-xl py-2">
                  Login
                </NavLink>
                <NavLink to="/signin" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center text-sm bg-indigo-600 text-white rounded-xl py-2 font-medium">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Navbar
