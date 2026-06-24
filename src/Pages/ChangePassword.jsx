import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in first</h2>
                <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Go to Login</button>
            </div>
        )
    }

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.newPassword !== form.confirmPassword) {
            setError('New password and confirm password do not match')
            return
        }
        if (form.newPassword.length < 8) {
            setError('New password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            const res = await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
            toast.success(res.data.message || 'Password changed successfully')
            navigate('/profile')
        } catch (err) {
            setError(err.response?.data?.message || 'Could not change password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h1>
                <p className="text-sm text-gray-500 mb-6">Update your account password securely.</p>
                {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} placeholder="Current password" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                    <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="New password" minLength={8} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" minLength={8} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">{loading ? 'Changing...' : 'Change Password'}</button>
                </form>
                <NavLink to="/profile" className="block text-center text-sm text-gray-400 hover:text-indigo-600 mt-5">← Back to profile</NavLink>
            </div>
        </div>
    )
}

export default ChangePassword
