import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { userApi } from '../../api/user.api'
import { toast } from 'react-toastify'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [actingId, setActingId] = useState(null)

    const fetchUsers = () => {
        setLoading(true)
        setError('')
        userApi.getAll({ search: search || undefined })
            .then(res => { if (res.data.success) setUsers(res.data.users) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const t = setTimeout(fetchUsers, 300)
        return () => clearTimeout(t)
    }, [search])

    const handleToggleBlock = async (id) => {
        setActingId(id)
        try {
            const res = await userApi.toggleBlock(id)
            if (res.data.success) {
                setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: res.data.user.isBlocked } : u))
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user')
        } finally {
            setActingId(null)
        }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
        setActingId(id)
        try {
            const res = await userApi.remove(id)
            if (res.data.success) {
                toast.success('User deleted')
                setUsers(prev => prev.filter(u => u._id !== id))
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user')
        } finally {
            setActingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Users</h1>
                <p className="text-sm text-gray-500">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
            </div>

            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full sm:max-w-md border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-center py-16 text-gray-400">{error}</p>
                ) : users.length === 0 ? (
                    <p className="text-center py-16 text-gray-400">No users found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">User</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Email</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Joined</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Status</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <NavLink to={`/admin/users/${u._id}`} className="font-medium text-gray-800 hover:text-indigo-600 truncate">
                                                    {u.name}
                                                </NavLink>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-500">{u.email}</td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${u.isBlocked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleBlock(u._id)}
                                                    disabled={actingId === u._id}
                                                    className={`font-medium text-xs border px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${
                                                        u.isBlocked
                                                            ? 'text-green-600 border-green-200 hover:bg-green-50'
                                                            : 'text-orange-500 border-orange-200 hover:bg-orange-50'
                                                    }`}
                                                >
                                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u._id, u.name)}
                                                    disabled={actingId === u._id}
                                                    className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default AdminUsers
