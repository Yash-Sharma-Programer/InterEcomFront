import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { orderApi } from '../api/order.api'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const STEPS = ['pending', 'processing', 'shipped', 'delivered']

const OrderDetail = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        orderApi.getById(id)
            .then(res => {
                if (res.data.success) setOrder(res.data.order)
                else setError('Order not found')
            })
            .catch(() => setError('Could not load this order'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="text-center py-24 text-gray-500">
                <span className="text-5xl block mb-4">⚠️</span>
                <p className="text-lg">{error || 'Order not found'}</p>
                <NavLink to="/my-orders" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Back to My Orders</NavLink>
            </div>
        )
    }

    const currentStepIndex = order.status === 'cancelled' ? -1 : STEPS.indexOf(order.status)

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <NavLink to="/my-orders" className="text-sm text-indigo-600 hover:underline">← Back to My Orders</NavLink>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
                            <p className="text-xs text-gray-400 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                    </div>

                    {/* Status tracker */}
                    {order.status !== 'cancelled' && (
                        <div className="flex items-center mb-2">
                            {STEPS.map((step, i) => (
                                <div key={step} className="flex-1 flex items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i <= currentStepIndex ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {i <= currentStepIndex ? '✓' : i + 1}
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-1 rounded ${i < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-100'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {order.status !== 'cancelled' && (
                        <div className="flex justify-between text-[10px] text-gray-400 mb-6">
                            {STEPS.map(step => <span key={step} className="capitalize w-6 text-center">{step}</span>)}
                        </div>
                    )}

                    {/* Items */}
                    <div className="space-y-3 border-t border-gray-50 pt-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="w-14 h-14 object-contain rounded-lg bg-gray-50 border shrink-0"
                                    onError={e => e.target.src = 'https://via.placeholder.com/56'}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{item.productPrice.toLocaleString('en-IN')} each</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">₹{(item.productPrice * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between font-bold text-gray-800 pt-4 mt-2 border-t border-gray-50">
                        <span>Total</span>
                        <span className="text-indigo-600">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">💳 Payment</h2>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Method</span>
                        <span className="font-medium text-gray-800">{order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Status</span>
                        <span className="font-medium capitalize text-gray-800">{order.paymentStatus}</span>
                    </div>
                </div>

                {/* Delivery address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">📦 Delivery Address</h2>
                    <p className="text-sm text-gray-700 font-medium">{order.address?.name}</p>
                    <p className="text-sm text-gray-500">{order.address?.phone}</p>
                    <p className="text-sm text-gray-500">{order.address?.street}, {order.address?.city} — {order.address?.pincode}</p>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
