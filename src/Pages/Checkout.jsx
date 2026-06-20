import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { orderApi } from '../api/order.api'
import { toast } from 'react-toastify'

const Checkout = () => {
    const { user } = useAuth()
    const { cart, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    const savedAddresses = user?.addresses || []
    const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0]

    const [useSavedId, setUseSavedId] = useState(defaultAddress?._id || '')
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [address, setAddress] = useState({
        name: defaultAddress?.name || user?.name || '',
        phone: defaultAddress?.phone || '',
        street: defaultAddress?.street || '',
        city: defaultAddress?.city || '',
        pincode: defaultAddress?.pincode || '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [placedOrder, setPlacedOrder] = useState(null)

    useEffect(() => {
        if (!useSavedId) return
        const addr = savedAddresses.find(a => a._id === useSavedId)
        if (addr) {
            setAddress({ name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, pincode: addr.pincode })
        }
    }, [useSavedId])

    // Not logged in -> ask to log in first
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to checkout</h2>
                <p className="text-gray-500 text-sm max-w-sm">
                    You need to be logged in to place an order.
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

    if (cart.length === 0 && !placedOrder) {
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
        setUseSavedId('')
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
            const res = await orderApi.place({
                items: cart.map(item => ({
                    product: item._id,
                    productName: item.Product_name,
                    productPrice: item.Product_Price,
                    productImage: item.images?.[0] || item.Product_URl,
                    quantity: item.qty,
                })),
                address,
                paymentMethod,
                userId: user?._id || user?.id || null,
            })

            if (res.data.success) {
                clearCart()
                setPlacedOrder(res.data.order)
                toast.success('Order placed successfully!')
            } else {
                setError(res.data.message || 'Order failed. Please try again.')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not connect to server.')
        } finally {
            setLoading(false)
        }
    }

    if (placedOrder) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <div className="text-6xl animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
                <p className="text-gray-500">
                    Confirmation will be sent to <span className="font-medium text-indigo-600">{user.email}</span>
                </p>
                <p className="text-sm text-gray-400">Order #{placedOrder._id.slice(-8).toUpperCase()}</p>
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
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                        📦 Delivery Address
                    </h2>

                    {savedAddresses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {savedAddresses.map(addr => (
                                <button
                                    key={addr._id}
                                    type="button"
                                    onClick={() => setUseSavedId(addr._id)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${useSavedId === addr._id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                                >
                                    {addr.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => { setUseSavedId(''); setAddress({ name: user.name, phone: '', street: '', city: '', pincode: '' }) }}
                                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${!useSavedId ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                            >
                                + New Address
                            </button>
                        </div>
                    )}

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

                {/* Payment method */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                        💳 Payment Method
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`text-sm font-medium py-2.5 rounded-xl border transition ${paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                        >
                            Cash on Delivery
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('online')}
                            className={`text-sm font-medium py-2.5 rounded-xl border transition ${paymentMethod === 'online' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                        >
                            Pay Online
                        </button>
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
                <p className="text-xs text-center text-gray-400">Free shipping on all orders</p>

                <NavLink to="/" className="block text-center text-sm text-gray-400 hover:text-indigo-600 transition">
                    ← Back to shopping
                </NavLink>
            </div>
        </div>
    )
}

export default Checkout
