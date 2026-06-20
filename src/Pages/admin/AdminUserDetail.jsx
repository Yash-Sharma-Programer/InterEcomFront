import { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { userApi } from '../../api/user.api'
import { toast } from 'react-toastify'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const AdminUserDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [acting, setActing] = useState(false)

    const fetchUser = () => {
        setLoading(true)
        setError('')
        userApi.getById(id)
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.user)
                    setOrders(res.data.orders)
                } else {
                    setError('User not found')
                }
            })
            .catch(err => setError(err.response?.data?.message || 'Could not load user'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchUser() }, [id])

    const handleToggleBlock = async () => {
        setActing(true)
        try {
            const res = await userApi.toggleBlock(id)
            if (res.data.success) {
                setUser(prev => ({ ...prev, isBlocked: res.data.user.isBlocked }))
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user')
        } finally {
            setActing(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return
        setActing(true)
        try {
            const res = await userApi.remove(id)
            if (res.data.success) {
                toast.success('User deleted')
                navigate('/admin/users')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user')
            setActing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="text-center py-16 text-gray-500">
                <span className="text-5xl block mb-4">⚠️</span>
                <p>{error || 'User not found'}</p>
                <NavLink to="/admin/users" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Back to Users</NavLink>
            </div>
        )
    }

    return (
        <div className="max-w-3xl space-y-6">
            <NavLink to="/admin/users" className="text-sm text-indigo-600 hover:underline">← Back to Users</NavLink>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">{user.name}</h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${user.isBlocked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={handleToggleBlock}
                        disabled={acting}
                        className={`text-sm font-medium border px-4 py-2 rounded-xl transition disabled:opacity-50 ${
                            user.isBlocked
                                ? 'text-green-600 border-green-200 hover:bg-green-50'
                                : 'text-orange-500 border-orange-200 hover:bg-orange-50'
                        }`}
                    >
                        {user.isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={acting}
                        className="text-sm font-medium text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                    >
                        Delete User
                    </button>
                </div>
            </div>

            {user.addresses?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">📍 Saved Addresses</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {user.addresses.map(a => (
                            <div key={a._id} className="border border-gray-100 rounded-xl p-3 text-sm">
                                <p className="font-medium text-gray-800">{a.label} {a.isDefault && <span className="text-xs text-indigo-600">(Default)</span>}</p>
                                <p className="text-gray-500">{a.name} · {a.phone}</p>
                                <p className="text-gray-500">{a.street}, {a.city} — {a.pincode}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Order History ({orders.length})</h2>
                </div>
                {orders.length === 0 ? (
                    <p className="text-center py-12 text-gray-400">No orders yet</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {orders.map(o => (
                            <NavLink key={o._id} to={`/admin/orders/${o._id}`} className="px-5 sm:px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">#{o._id.slice(-8).toUpperCase()} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {o.status}
                                </span>
                                <span className="text-sm font-bold text-indigo-600 shrink-0">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUserDetail
