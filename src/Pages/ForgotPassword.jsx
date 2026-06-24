import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const res = await authApi.forgotPassword({ email })
            setMessage(res.data.message || 'Reset link sent to your email')
            toast.success('Check your email for reset link')
        } catch (err) {
            setError(err.response?.data?.message || 'Could not send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔑</span>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Forgot Password</h1>
                    <p className="text-gray-500 text-sm mt-1">Enter your email and get a reset link</p>
                </div>

                {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{message}</div>}
                {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Remember password? <NavLink to="/login" className="text-indigo-600 font-medium hover:underline">Login</NavLink>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword
