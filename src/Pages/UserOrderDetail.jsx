import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
}

const UserOrderDetail = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const adminUsername = sessionStorage.getItem('adminUsername')
    const adminPassword = sessionStorage.getItem('adminPassword')

    useEffect(() => {
        if (!adminUsername || !adminPassword) { navigate('/adminlogin'); return }
        fetch(`https://ecom-backend-ovxs.vercel.app/admin/users/${userId}/orders`, {
            headers: { adminusername: adminUsername, adminpassword: adminPassword }
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) setData(d)
                else setError(d.message)
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <span className="text-5xl">⚠️</span>
            <p className="text-gray-600">{error}</p>
            <button onClick={() => navigate('/admin')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">← Back</button>
        </div>
    )

    const { user, orders } = data
    const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0)
    const totalItems = orders.reduce((s, o) => s + o.quantity, 0)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                    ← Back to Dashboard
                </button>
                <div className="h-4 w-px bg-gray-200" />
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Order Details — {user.name}</h1>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                {user.isBlocked && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">🚫 Blocked</span>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* User Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                        <span className="text-2xl mb-1">📦</span>
                        <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                        <p className="text-sm text-gray-400">Total Orders</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                        <span className="text-2xl mb-1">💰</span>
                        <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-gray-400">Total Spent</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                        <span className="text-2xl mb-1">🛍</span>
                        <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                        <p className="text-sm text-gray-400">Items Ordered</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                        <span className="text-2xl mb-1">📅</span>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-400">Member Since</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Order History</h2>
                    </div>
                    {orders.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <span className="text-5xl block mb-3">🛒</span>
                            <p>No orders placed yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Qty</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Delivery Address</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {o.productImage && (
                                                        <img src={o.productImage} alt={o.productName} className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100" onError={e => e.target.style.display='none'} />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{o.productName}</p>
                                                        <p className="text-xs text-gray-400">₹{o.productPrice?.toLocaleString('en-IN')} each</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">{o.quantity}</td>
                                            <td className="px-6 py-4 font-bold text-indigo-600">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600 space-y-0.5">
                                                    <p className="font-medium">{o.address?.name}</p>
                                                    <p>{o.address?.phone}</p>
                                                    <p className="text-gray-400">{o.address?.street}, {o.address?.city} - {o.address?.pincode}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-100 bg-gray-50">
                                        <td colSpan={2} className="px-6 py-3 font-bold text-gray-700">Total</td>
                                        <td className="px-6 py-3 font-bold text-indigo-600 text-base">₹{totalRevenue.toLocaleString('en-IN')}</td>
                                        <td colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserOrderDetail
