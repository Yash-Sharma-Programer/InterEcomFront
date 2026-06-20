import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/categories', label: 'Categories', icon: '🗂' },
    { to: '/admin/orders', label: 'Orders', icon: '🧾' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { to: '/admin/pages', label: 'Pages', icon: '📄' },
    { to: '/admin/menus', label: 'Menus', icon: '🧭' },
    { to: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
]

const AdminLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/adminlogin')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-indigo-600">🛍 ShopZen Admin</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 text-xl">✕</button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="border-t border-gray-100 p-4">
                    <p className="text-xs text-gray-400 mb-2 truncate">{user?.email}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl font-medium transition text-left"
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 lg:ml-0">
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-xl">☰</button>
                    <span className="font-bold text-indigo-600">🛍 ShopZen Admin</span>
                </div>
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
