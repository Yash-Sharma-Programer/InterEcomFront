import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
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

        fetch(`https://ecom-backend-ovxs.vercel.app/orders/user/${userId}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders)
                else setError('Failed to load your orders')
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false))
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
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
        <div className="min-h-screen bg-gray-50 py-10 px-4">
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
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-4">
                                <img
                                    src={order.productImage}
                                    alt={order.productName}
                                    className="w-20 h-20 object-contain rounded-xl bg-gray-50 border shrink-0"
                                    onError={e => e.target.src = 'https://via.placeholder.com/80'}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-800 truncate">{order.productName}</h3>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Qty: {order.quantity}</p>
                                    <p className="text-indigo-600 font-bold mt-1">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Delivering to {order.address?.name}, {order.address?.city} — {order.address?.pincode}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders
