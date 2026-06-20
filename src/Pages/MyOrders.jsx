import { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/order.api'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const MyOrders = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return
        const userId = user._id || user.id
        setLoading(true)
        setError(null)

        orderApi.getUserOrders(userId)
            .then(res => {
                if (res.data.success) setOrders(res.data.orders)
                else setError('Failed to load your orders')
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false))
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to view your orders</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 text-gray-500">
                        <span className="text-5xl block mb-4">⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100">
                        <span className="text-5xl block mb-4">📦</span>
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="text-sm mt-1">Items you buy will show up here.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <NavLink
                                key={order._id}
                                to={`/my-orders/${order._id}`}
                                className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                    </span>
                                </div>

                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {order.items.slice(0, 4).map((item, i) => (
                                        <img
                                            key={i}
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-14 h-14 object-contain rounded-lg bg-gray-50 border shrink-0"
                                            onError={e => e.target.src = 'https://via.placeholder.com/56'}
                                        />
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="w-14 h-14 rounded-lg bg-gray-50 border flex items-center justify-center text-xs text-gray-400 shrink-0">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                    <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod === 'online' ? 'Paid Online' : 'Cash on Delivery'}</p>
                                    <p className="text-indigo-600 font-bold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders
