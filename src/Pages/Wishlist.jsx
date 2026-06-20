import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import BuyNowModal from '../components/BuyNowModal'

const Wishlist = () => {
    const { user } = useAuth()
    const { wishlist, loading } = useWishlist()
    const navigate = useNavigate()
    const [buyNowProduct, setBuyNowProduct] = useState(null)

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to view your wishlist</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100">
                        <span className="text-5xl block mb-4">♡</span>
                        <p className="text-lg font-medium">Your wishlist is empty</p>
                        <p className="text-sm mt-1">Tap the heart icon on any product to save it here.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {wishlist.map(product => (
                            <ProductCard key={product._id} product={product} onBuyNow={setBuyNowProduct} />
                        ))}
                    </div>
                )}
            </div>

            {buyNowProduct && (
                <BuyNowModal product={buyNowProduct} onClose={() => setBuyNowProduct(null)} />
            )}
        </div>
    )
}

export default Wishlist
