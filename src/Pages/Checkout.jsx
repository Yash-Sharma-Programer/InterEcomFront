import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Checkout = () => {
    const { user } = useAuth()
    const { cart, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        street: '',
        city: '',
        pincode: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [placed, setPlaced] = useState(false)

    // Not logged in -> ask to log in first (email for checkout comes from the account)
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to checkout</h2>
                <p className="text-gray-500 text-sm max-w-sm">
                    Your account email is used for order confirmation, so you need to be logged in to proceed.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    if (cart.length === 0 && !placed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🛍</span>
                <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Continue Shopping
                </button>
            </div>
        )
    }

    const handleChange = (e) => {
        setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handlePlaceOrder = async () => {
        if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
            setError('Please fill in all fields.')
            return
        }
        if (!/^\d{10}$/.test(address.phone)) {
            setError('Enter a valid 10-digit phone number.')
            return
        }
        if (!/^\d{6}$/.test(address.pincode)) {
            setError('Enter a valid 6-digit pincode.')
            return
        }

        setError('')
        setLoading(true)

        try {
            // Backend order model stores one product per order, so place one order per cart line
            const results = await Promise.all(
                cart.map(item =>
                    fetch('https://ecom-backend-ovxs.vercel.app/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            product: item._id,
                            productName: item.Product_name,
                            productPrice: item.Product_Price,
                            productImage: item.Product_URl,
                            quantity: item.qty,
                            totalAmount: item.Product_Price * item.qty,
                            address,
                            userId: user?._id || user?.id || null,
                        }),
                    }).then(res => res.json())
                )
            )

            const allOk = results.every(r => r.success)
            if (allOk) {
                clearCart()
                setPlaced(true)
            } else {
                setError('Some items could not be ordered. Please try again.')
            }
        } catch {
            setError('Could not connect to server.')
        } finally {
            setLoading(false)
        }
    }

    if (placed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <div className="text-6xl animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
                <p className="text-gray-500">
                    Confirmation will be sent to <span className="font-medium text-indigo-600">{user.email}</span>
                </p>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition font-medium"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

                {/* Account email — taken from logged in account */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Contact Email</h2>
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                        <span className="text-lg">📧</span>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none cursor-not-allowed"
                        />
                        <span className="text-xs text-gray-400">from your account</span>
                    </div>
                </div>

                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h2>
                    <div className="space-y-2">
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-50">
                                <span className="truncate max-w-xs">{item.Product_name} × {item.qty}</span>
                                <span className="font-medium text-indigo-600">₹{(item.Product_Price * item.qty).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-gray-800 pt-2">
                            <span>Total</span>
                            <span className="text-indigo-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                        📦 Delivery Address
                    </h2>
                    <div className="space-y-2">
                        {[
                            { name: 'name', placeholder: 'Full Name', type: 'text' },
                            { name: 'phone', placeholder: 'Phone Number (10 digits)', type: 'tel' },
                            { name: 'street', placeholder: 'Street / Flat / Area', type: 'text' },
                            { name: 'city', placeholder: 'City', type: 'text' },
                            { name: 'pincode', placeholder: 'Pincode (6 digits)', type: 'text' },
                        ].map(field => (
                            <input
                                key={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={address[field.name]}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {error}
                    </p>
                )}

                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block" />
                    ) : `Place Order · ₹${totalPrice.toLocaleString('en-IN')}`}
                </button>
                <p className="text-xs text-center text-gray-400">Cash on Delivery · Free shipping</p>

                <NavLink to="/" className="block text-center text-sm text-gray-400 hover:text-indigo-600 transition">
                    ← Back to shopping
                </NavLink>
            </div>
        </div>
    )
}

export default Checkout
