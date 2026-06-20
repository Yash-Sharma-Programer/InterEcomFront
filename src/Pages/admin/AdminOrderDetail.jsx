import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { orderApi } from '../../api/order.api'
import { toast } from 'react-toastify'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const AdminOrderDetail = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [updating, setUpdating] = useState(false)

    const fetchOrder = () => {
        setLoading(true)
        setError('')
        orderApi.getById(id)
            .then(res => { if (res.data.success) setOrder(res.data.order); else setError('Order not found') })
            .catch(err => setError(err.response?.data?.message || 'Could not load order'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchOrder() }, [id])

    const handleStatusChange = async (newStatus) => {
        setUpdating(true)
        try {
            const res = await orderApi.updateStatus(id, newStatus)
            if (res.data.success) {
                setOrder(prev => ({ ...prev, status: newStatus }))
                toast.success('Order status updated')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status')
        } finally {
            setUpdating(false)
        }
    }

    const handlePaymentChange = async (newStatus) => {
        setUpdating(true)
        try {
            const res = await orderApi.updatePaymentStatus(id, newStatus)
            if (res.data.success) {
                setOrder(prev => ({ ...prev, paymentStatus: newStatus }))
                toast.success('Payment status updated')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update payment status')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="text-center py-16 text-gray-500">
                <span className="text-5xl block mb-4">⚠️</span>
                <p>{error || 'Order not found'}</p>
                <NavLink to="/admin/orders" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Back to Orders</NavLink>
            </div>
        )
    }

    return (
        <div className="max-w-3xl space-y-6">
            <NavLink to="/admin/orders" className="text-sm text-indigo-600 hover:underline">← Back to Orders</NavLink>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
                        <select
                            value={order.status}
                            disabled={updating}
                            onChange={e => handleStatusChange(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
                        <select
                            value={order.paymentStatus}
                            disabled={updating}
                            onChange={e => handlePaymentChange(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3 border-t border-gray-50 pt-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <img src={item.productImage} alt={item.productName} className="w-14 h-14 object-contain rounded-lg bg-gray-50 border shrink-0"
                                onError={e => e.target.src = 'https://via.placeholder.com/56'} />
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

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">👤 Customer</h2>
                    <p className="text-sm text-gray-700 font-medium">{order.userId?.name || order.address?.name}</p>
                    <p className="text-sm text-gray-500">{order.userId?.email || 'Guest checkout'}</p>
                    <p className="text-sm text-gray-500">{order.address?.phone}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">📦 Delivery Address</h2>
                    <p className="text-sm text-gray-700">{order.address?.street}</p>
                    <p className="text-sm text-gray-700">{order.address?.city} — {order.address?.pincode}</p>
                </div>
            </div>
        </div>
    )
}

export default AdminOrderDetail
