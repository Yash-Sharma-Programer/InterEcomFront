import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const StatCard = ({ icon, label, value, sub, color }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4`}>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
)

const BarChart = ({ data, labelKey, valueKey, title, color = '#6366f1', prefix = '', suffix = '' }) => {
    const max = Math.max(...data.map(d => d[valueKey]), 1)
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">{title}</h3>
            {data.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No data available</p>
            ) : (
                <div className="flex items-end gap-2 h-40">
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500 font-medium">{prefix}{d[valueKey].toLocaleString('en-IN')}{suffix}</span>
                            <div
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                    height: `${Math.max((d[valueKey] / max) * 100, 4)}%`,
                                    backgroundColor: color
                                }}
                            />
                            <span className="text-xs text-gray-400 truncate w-full text-center">{d[labelKey]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('overview')
    const [deletingId, setDeletingId] = useState(null)

    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [ordersError, setOrdersError] = useState('')
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [orderStatusFilter, setOrderStatusFilter] = useState('all')

    const adminUsername = sessionStorage.getItem('adminUsername')
    const adminPassword = sessionStorage.getItem('adminPassword')

    useEffect(() => {
        if (!adminUsername || !adminPassword) {
            navigate('/adminlogin')
            return
        }
        fetchAnalytics()
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setOrdersLoading(true)
        setOrdersError('')
        try {
            const res = await fetch('https://ecom-backend-ovxs.vercel.app/orders', {
                headers: {
                    adminusername: adminUsername,
                    adminpassword: adminPassword
                }
            })
            const data = await res.json()
            if (data.success) setOrders(data.orders)
            else setOrdersError(data.message || 'Failed to load orders')
        } catch {
            setOrdersError('Could not connect to server')
        } finally {
            setOrdersLoading(false)
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId)
        try {
            const res = await fetch(`https://ecom-backend-ovxs.vercel.app/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    adminusername: adminUsername,
                    adminpassword: adminPassword
                },
                body: JSON.stringify({ status: newStatus })
            })
            const data = await res.json()
            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
            } else {
                alert(data.message || 'Failed to update status')
            }
        } catch {
            alert('Could not connect to server')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const fetchAnalytics = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('https://ecom-backend-ovxs.vercel.app/admin/analytics', {
                headers: {
                    adminusername: adminUsername,
                    adminpassword: adminPassword
                }
            })
            const data = await res.json()
            if (data.success) setAnalytics(data.analytics)
            else setError(data.message || 'Failed to load analytics')
        } catch {
            setError('Could not connect to server')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        setDeletingId(id)
        try {
            const res = await fetch(`https://ecom-backend-six-sigma.vercel.app/products/${id}`, {
                method: 'DELETE',
                headers: {
                    adminUsername,
                    adminPassword
                }
            })
            const data = await res.json()
            if (data.success) fetchAnalytics()
            else alert(data.message)
        } catch {
            alert('Failed to delete product')
        } finally {
            setDeletingId(null)
        }
    }

    const buildMonthlyChartData = (byMonth) => {
        if (!byMonth || byMonth.length === 0) return []
        return byMonth.map(d => ({
            label: `${MONTHS[d._id.month - 1]} ${String(d._id.year).slice(-2)}`,
            count: d.count,
            totalValue: d.totalValue || 0
        }))
    }

    const buildPriceRangeData = (ranges) => {
        if (!ranges) return []
        const labels = { 0: '₹0-500', 500: '₹500-1K', 1000: '₹1K-2.5K', 2500: '₹2.5K-5K', 5000: '₹5K-10K', 10000: '₹10K+', Other: 'Other' }
        return ranges.map(r => ({ label: labels[r._id] || r._id, count: r.count }))
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <span className="text-5xl">⚠️</span>
            <p className="text-gray-600">{error}</p>
            <button onClick={fetchAnalytics} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">Retry</button>
        </div>
    )

    const { summary, productsByMonth, usersByMonth, priceRanges, topProducts, recentUsers, recentProducts } = analytics

    const tabs = ['overview', 'products', 'users', 'orders']

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Analytics & Management</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchAnalytics}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
                    >
                        🔄 Refresh
                    </button>
                    <button
                        onClick={() => { navigate('/addproduct') }}
                        className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon="📦" label="Total Products" color="bg-indigo-50"
                                value={summary.totalProducts}
                                sub="Listed in store"
                            />
                            <StatCard
                                icon="👥" label="Total Users" color="bg-blue-50"
                                value={summary.totalUsers}
                                sub="Registered accounts"
                            />
                            <StatCard
                                icon="💰" label="Inventory Value" color="bg-green-50"
                                value={`₹${Number(summary.totalInventoryValue).toLocaleString('en-IN')}`}
                                sub="Sum of all prices"
                            />
                            <StatCard
                                icon="📊" label="Avg. Price" color="bg-purple-50"
                                value={`₹${Math.round(summary.avgProductPrice).toLocaleString('en-IN')}`}
                                sub="Per product"
                            />
                        </div>

                        {/* Orders Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon="🧾" label="Total Orders" color="bg-orange-50"
                                value={orders.length}
                                sub="All time"
                            />
                            <StatCard
                                icon="💵" label="Order Revenue" color="bg-green-50"
                                value={`₹${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}`}
                                sub="Sum of all orders"
                            />
                            <StatCard
                                icon="⏳" label="Pending" color="bg-yellow-50"
                                value={orders.filter(o => o.status === 'pending').length}
                                sub="Awaiting confirmation"
                            />
                            <StatCard
                                icon="🚚" label="Shipped" color="bg-purple-50"
                                value={orders.filter(o => o.status === 'shipped').length}
                                sub="On the way"
                            />
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChart
                                data={buildMonthlyChartData(productsByMonth)}
                                labelKey="label"
                                valueKey="count"
                                title="Products Added (Last 6 Months)"
                                color="#6366f1"
                            />
                            <BarChart
                                data={buildMonthlyChartData(usersByMonth)}
                                labelKey="label"
                                valueKey="count"
                                title="New Users (Last 6 Months)"
                                color="#3b82f6"
                            />
                        </div>

                        {/* Price Range + Top Products */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChart
                                data={buildPriceRangeData(priceRanges)}
                                labelKey="label"
                                valueKey="count"
                                title="Products by Price Range"
                                color="#8b5cf6"
                            />
                            {/* Top expensive products */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-base font-semibold text-gray-700 mb-4">Top Products by Price</h3>
                                <div className="space-y-3">
                                    {topProducts.length === 0 ? (
                                        <p className="text-gray-400 text-sm text-center py-4">No products yet</p>
                                    ) : topProducts.map((p, i) => (
                                        <div key={p._id} className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                                                {i + 1}
                                            </span>
                                            <img
                                                src={p.Product_URl}
                                                alt={p.Product_name}
                                                className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100"
                                                onError={e => e.target.src = 'https://via.placeholder.com/40?text=?'}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{p.Product_name}</p>
                                            </div>
                                            <span className="text-sm font-bold text-indigo-600 shrink-0">
                                                ₹{Number(p.Product_Price).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Preview */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    View all →
                                </button>
                            </div>
                            {ordersLoading ? (
                                <p className="text-gray-400 text-sm text-center py-8">Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {orders.slice(0, 5).map(o => (
                                        <div key={o._id} className="px-6 py-3 flex items-center gap-3">
                                            <img
                                                src={o.productImage}
                                                alt={o.productName}
                                                className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                                                onError={e => e.target.src = 'https://via.placeholder.com/40?text=?'}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{o.productName} × {o.quantity}</p>
                                                <p className="text-xs text-gray-400">{o.address?.name} · {o.address?.city}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                                            </span>
                                            <span className="text-sm font-bold text-indigo-600 shrink-0">
                                                ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">All Products ({recentProducts.length})</h3>
                            <button
                                onClick={() => navigate('/addproduct')}
                                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                            >
                                + Add Product
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Product Name</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Added</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-gray-400">No products found</td>
                                        </tr>
                                    ) : recentProducts.map(p => (
                                        <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                            <td className="px-6 py-3">
                                                <img
                                                    src={p.Product_URl}
                                                    alt={p.Product_name}
                                                    className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100"
                                                    onError={e => e.target.src = 'https://via.placeholder.com/48?text=?'}
                                                />
                                            </td>
                                            <td className="px-6 py-3 font-medium text-gray-800 max-w-xs truncate">{p.Product_name}</td>
                                            <td className="px-6 py-3 font-bold text-indigo-600">₹{Number(p.Product_Price).toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    disabled={deletingId === p._id}
                                                    className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    {deletingId === p._id ? 'Deleting...' : '🗑 Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Registered Users ({recentUsers.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 font-medium text-gray-500">Avatar</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                                        <th className="px-6 py-3 font-medium text-gray-500">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12 text-gray-400">No users found</td>
                                        </tr>
                                    ) : recentUsers.map(u => (
                                        <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                            <td className="px-6 py-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{u.email}</td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-800">
                                Orders Summary ({orders.filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter).length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <select
                                    value={orderStatusFilter}
                                    onChange={e => setOrderStatusFilter(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                    onClick={fetchOrders}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
                                >
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>

                        {ordersLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                            </div>
                        ) : ordersError ? (
                            <p className="text-center py-16 text-gray-400">{ordersError}</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                                            <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                                            <th className="px-6 py-3 font-medium text-gray-500">Qty</th>
                                            <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                                            <th className="px-6 py-3 font-medium text-gray-500">Placed On</th>
                                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter).length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-gray-400">No orders found</td>
                                            </tr>
                                        ) : orders
                                            .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                                            .map(o => (
                                            <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={o.productImage}
                                                            alt={o.productName}
                                                            className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                                                            onError={e => e.target.src = 'https://via.placeholder.com/48?text=?'}
                                                        />
                                                        <span className="font-medium text-gray-800 max-w-[160px] truncate">{o.productName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">
                                                    <p className="font-medium text-gray-800">{o.address?.name}</p>
                                                    <p className="text-xs text-gray-400">{o.address?.phone}</p>
                                                    <p className="text-xs text-gray-400">{o.address?.street}, {o.address?.city} - {o.address?.pincode}</p>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600">{o.quantity}</td>
                                                <td className="px-6 py-3 font-bold text-indigo-600">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-3 text-gray-500">
                                                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <select
                                                        value={o.status}
                                                        disabled={updatingOrderId === o._id}
                                                        onChange={e => handleStatusChange(o._id, e.target.value)}
                                                        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 ${statusStyles[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
