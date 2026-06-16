import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BuyNowModal = ({ product, onClose }) => {
    const { user } = useAuth()
    const [qty, setQty] = useState(1)
    const [step, setStep] = useState('details') // 'details' | 'success'
    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        street: '',
        city: '',
        pincode: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!product) return null

    const total = product.Product_Price * qty

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
            const res = await fetch('https://ecom-backend-ovxs.vercel.app/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    product: product._id,
                    productName: product.Product_name,
                    productPrice: product.Product_Price,
                    productImage: product.Product_URl,
                    quantity: qty,
                    totalAmount: total,
                    address,
                    userId: user?._id || user?.id || null,
                }),
            })
            const data = await res.json()
            if (data.success) {
                setStep('success')
            } else {
                setError(data.message || 'Order failed. Please try again.')
            }
        } catch {
            setError('Could not connect to server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {step === 'success' ? (
                        /* ── Success screen ── */
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="text-6xl mb-4 animate-bounce">🎉</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                            <p className="text-gray-500 mb-1">
                                <span className="font-semibold text-indigo-600">{product.Product_name}</span> × {qty}
                            </p>
                            <p className="text-gray-500 mb-6">
                                Total paid: <span className="font-bold text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-6">
                                Delivering to <span className="font-medium">{address.name}</span>, {address.city} — {address.pincode}
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        /* ── Details screen ── */
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-lg font-bold text-gray-800">Buy Now ⚡</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="px-5 py-5 space-y-5">
                                {/* Product summary */}
                                <div className="flex gap-4 items-center bg-gray-50 rounded-xl p-3">
                                    <img
                                        src={product.Product_URl}
                                        alt={product.Product_name}
                                        className="w-16 h-16 object-contain rounded-lg bg-white border"
                                        onError={e => e.target.src = 'https://via.placeholder.com/64'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{product.Product_name}</p>
                                        <p className="text-indigo-600 font-bold">₹{Number(product.Product_Price).toLocaleString('en-IN')}</p>
                                    </div>
                                    {/* Qty control */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700"
                                        >−</button>
                                        <span className="w-6 text-center font-semibold">{qty}</span>
                                        <button
                                            onClick={() => setQty(q => q + 1)}
                                            className="w-7 h-7 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center font-bold text-indigo-700"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Delivery address */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                                        📦 Delivery Address
                                    </h3>
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
                                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                        {error}
                                    </p>
                                )}

                                {/* Order total + CTA */}
                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-700 font-semibold">
                                        <span>Order Total</span>
                                        <span className="text-indigo-600 text-lg">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block" />
                                        ) : '⚡ Place Order'}
                                    </button>
                                    <p className="text-xs text-center text-gray-400">Cash on Delivery · Free shipping</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default BuyNowModal
