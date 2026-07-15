import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartDrawer = ({ open, onClose }) => {
    const { cart, removeFromCart, updateQty, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    const handleCheckout = () => {
        onClose()
        navigate('/checkout')
    }

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Your Cart 🛒</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <span className="text-6xl">🛍</span>
                        <p className="text-lg font-medium">Your cart is empty</p>
                        <p className="text-sm">Add some products to get started!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {cart.map(item => (
                                <div key={item._id} className="flex gap-3 items-center border border-gray-100 rounded-xl p-3">
                                    <img
                                        src={item.Product_URl}
                                        alt={item.Product_name}
                                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                                        onError={e => e.target.src = 'https://via.placeholder.com/64'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{item.Product_name}</p>
                                        <p className="text-indigo-600 font-bold text-sm">₹{item.Product_Price}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => updateQty(item._id, item.qty - 1)}
                                                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                                            >−</button>
                                            <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item._id, item.qty + 1)}
                                                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-400 hover:text-red-600 text-lg"
                                    >🗑</button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t px-5 py-4 space-y-3">
                            <div className="flex justify-between text-gray-700 font-semibold text-base">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                Proceed to Checkout
                            </button>
                            <button onClick={clearCart} className="w-full text-sm text-gray-400 hover:text-red-500 transition text-center">
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default CartDrawer
