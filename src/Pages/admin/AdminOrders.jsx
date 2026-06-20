import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { orderApi } from '../../api/order.api'
import { toast } from 'react-toastify'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const paymentStyles = {
    pending: 'bg-yellow-50 text-yellow-700',
    paid: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-700',
    refunded: 'bg-gray-50 text-gray-600',
}

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentFilter, setPaymentFilter] = useState('all')
    const [updatingId, setUpdatingId] = useState(null)

    const fetchOrders = () => {
        setLoading(true)
        setError('')
        orderApi.getAll({
            status: statusFilter !== 'all' ? statusFilter : undefined,
            paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
            search: search || undefined,
        })
            .then(res => { if (res.data.success) setOrders(res.data.orders) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const t = setTimeout(fetchOrders, 300)
        return () => clearTimeout(t)
    }, [search, statusFilter, paymentFilter])

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId)
        try {
            const res = await orderApi.updateStatus(orderId, newStatus)
            if (res.data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
                toast.success('Order status updated')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status')
        } finally {
            setUpdatingId(null)
        }
    }

    const handlePaymentChange = async (orderId, newStatus) => {
        setUpdatingId(orderId)
        try {
            const res = await orderApi.updatePaymentStatus(orderId, newStatus)
            if (res.data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: newStatus } : o))
                toast.success('Payment status updated')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update payment status')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Orders</h1>
                <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by customer name, phone, product..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-center py-16 text-gray-400">{error}</p>
                ) : orders.length === 0 ? (
                    <p className="text-center py-16 text-gray-400">No orders found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Order</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Customer</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Items</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Amount</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Payment</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Status</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                        <td className="px-4 sm:px-6 py-3">
                                            <p className="font-medium text-gray-800">#{o._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-600">
                                            <p className="font-medium text-gray-800">{o.address?.name}</p>
                                            <p className="text-xs text-gray-400">{o.address?.phone}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-600">{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                                        <td className="px-4 sm:px-6 py-3 font-bold text-indigo-600">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <select
                                                value={o.paymentStatus}
                                                disabled={updatingId === o._id}
                                                onChange={e => handlePaymentChange(o._id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 ${paymentStyles[o.paymentStatus] || 'bg-gray-50 text-gray-600'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <select
                                                value={o.status}
                                                disabled={updatingId === o._id}
                                                onChange={e => handleStatusChange(o._id, e.target.value)}
                                                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 ${statusStyles[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <NavLink to={`/admin/orders/${o._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                                                View
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminOrders
