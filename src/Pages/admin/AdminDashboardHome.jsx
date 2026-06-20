import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { dashboardApi } from '../../api/dashboard.api'
import StatCard from '../../components/admin/StatCard'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const PIE_COLORS = ['#facc15', '#60a5fa', '#a78bfa', '#4ade80', '#f87171']

const AdminDashboardHome = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchStats = () => {
        setLoading(true)
        setError('')
        dashboardApi.getStats()
            .then(res => {
                if (res.data.success) setData(res.data)
                else setError(res.data.message || 'Failed to load dashboard')
            })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchStats() }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <span className="text-5xl">⚠️</span>
                <p className="text-gray-600">{error}</p>
                <button onClick={fetchStats} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">Retry</button>
            </div>
        )
    }

    const { stats, recentOrders, recentUsers, ordersByMonth, usersByMonth, orderStatusBreakdown, topProducts } = data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500">Store performance overview</p>
                </div>
                <button onClick={fetchStats} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition">
                    🔄 Refresh
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <StatCard icon="👥" label="Total Users" color="bg-blue-50" value={stats.totalUsers} />
                <StatCard icon="📦" label="Total Products" color="bg-indigo-50" value={stats.totalProducts} />
                <StatCard icon="🧾" label="Total Orders" color="bg-orange-50" value={stats.totalOrders} />
                <StatCard icon="🗂" label="Categories" color="bg-purple-50" value={stats.totalCategories} />
                <StatCard icon="💰" label="Total Revenue" color="bg-green-50" value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">Revenue & Orders (Last 6 Months)</h3>
                    {ordersByMonth.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-12">No order data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={ordersByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v, name) => name === 'revenue' ? `₹${Number(v).toLocaleString('en-IN')}` : v} />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} name="Revenue" />
                                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">Order Status Breakdown</h3>
                    {orderStatusBreakdown.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-12">No orders yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={orderStatusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={75} label={({ _id }) => _id}>
                                    {orderStatusBreakdown.map((entry, i) => (
                                        <Cell key={entry._id} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">New Users (Last 6 Months)</h3>
                {usersByMonth.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-12">No user signups yet</p>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={usersByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="New Users" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Recent Orders + Recent Users */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                        <NavLink to="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</NavLink>
                    </div>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentOrders.map(o => (
                                <div key={o._id} className="px-5 sm:px-6 py-3 flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{o.address?.name} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                                        <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                        {o.status}
                                    </span>
                                    <span className="text-sm font-bold text-indigo-600 shrink-0">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Recent Users</h3>
                        <NavLink to="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</NavLink>
                    </div>
                    {recentUsers.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentUsers.map(u => (
                                <div key={u._id} className="px-5 sm:px-6 py-3 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                                        {u.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Top products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Top Rated Products</h3>
                {topProducts.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No products yet</p>
                ) : (
                    <div className="space-y-3">
                        {topProducts.map((p, i) => (
                            <div key={p._id} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                <img src={p.Product_URl} alt={p.Product_name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100"
                                    onError={e => e.target.src = 'https://via.placeholder.com/40?text=?'} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{p.Product_name}</p>
                                    <p className="text-xs text-gray-400">★ {p.ratingAvg?.toFixed(1) || '0.0'} ({p.ratingCount || 0} reviews)</p>
                                </div>
                                <span className="text-sm font-bold text-indigo-600 shrink-0">₹{Number(p.Product_Price).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboardHome
