import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { user, logout } = useAuth()
    const { cart, totalItems, totalPrice } = useCart()
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to view your profile</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24"></div>
                    <div className="px-6 pb-6 -mt-12">
                        <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-extrabold text-indigo-600 mb-3">
                            {initials}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-700 mb-4">Account Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 py-2 border-b border-gray-50">
                            <span className="text-lg">👤</span>
                            <div>
                                <p className="text-xs text-gray-400">Full Name</p>
                                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 py-2">
                            <span className="text-lg">📧</span>
                            <div>
                                <p className="text-xs text-gray-400">Email Address</p>
                                <p className="text-sm font-medium text-gray-700">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-700 mb-4">🛒 Cart Summary</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-sm">Your cart is empty.</p>
                    ) : (
                        <div className="space-y-2">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-50">
                                    <span className="truncate max-w-xs">{item.Product_name} × {item.qty}</span>
                                    <span className="font-medium text-indigo-600">₹{(item.Product_Price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold text-gray-800 pt-2">
                                <span>{totalItems} items</span>
                                <span className="text-indigo-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
                    <h2 className="text-base font-bold text-gray-700 mb-2">Account Actions</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl transition"
                    >
                        🏠 <span>Back to Home</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition font-medium border border-red-100"
                    >
                        🚪 <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile
