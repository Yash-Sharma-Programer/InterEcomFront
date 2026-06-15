import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

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

    const adminUsername = sessionStorage.getItem('adminUsername')
    const adminPassword = sessionStorage.getItem('adminPassword')

    useEffect(() => {
        if (!adminUsername || !adminPassword) {
            navigate('/adminlogin')
            return
        }
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('http://localhost:3000/admin/analytics', {
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
            const res = await fetch(`http://localhost:3000/products/${id}`, {
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

    const tabs = ['overview', 'products', 'users']

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
            </div>
        </div>
    )
}

export default AdminDashboard
