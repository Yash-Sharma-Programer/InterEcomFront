import { useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            const res = await authApi.resetPassword(token, { password })
            toast.success(res.data.message || 'Password reset successfully')
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Could not reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Reset Password</h1>
                    <p className="text-gray-500 text-sm mt-1">Create a new password</p>
                </div>

                {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" minLength={8} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" minLength={8} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6"><NavLink to="/login" className="text-indigo-600 font-medium hover:underline">Back to Login</NavLink></p>
            </div>
        </div>
    )
}

export default ResetPassword
