import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

const ProductCard = ({ product, onBuyNow }) => {
    const { addToCart } = useCart()
    const { user } = useAuth()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const navigate = useNavigate()
    const [added, setAdded] = useState(false)

    const image = product.images?.[0] || product.Product_URl
    const outOfStock = product.stock !== undefined && product.stock <= 0
    const inWishlist = isInWishlist?.(product._id)

    const handleAddToCart = (e) => {
        e.preventDefault()
        if (!user) {
            navigate('/login')
            return
        }
        addToCart(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    const handleBuyNow = (e) => {
        e.preventDefault()
        if (!user) {
            navigate('/login')
            return
        }
        onBuyNow?.(product)
    }

    const handleWishlist = (e) => {
        e.preventDefault()
        toggleWishlist(product._id)
    }

    return (
        <NavLink
            to={`/product/${product._id}`}
            className="group  border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
        >
            <div className="relative overflow-hidden bg-gray-50 aspect-square sm:h-44">
                <img
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    src={image}
                    alt={product.Product_name}
                    loading="lazy"
                    onError={e => e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'}
                />
                <button
                    onClick={handleWishlist}
                    aria-label="Toggle wishlist"
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition ${
                        inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                    }`}
                >
                    {inWishlist ? '♥' : '♡'}
                </button>
                {outOfStock && (
                    <span className="absolute bottom-2 left-2 bg-gray-800/80 text-white text-[10px] font-semibold px-2 py-1 rounded-md">
                        Out of Stock
                    </span>
                )}
                {product.ratingCount > 0 && (
                    <span className="absolute bottom-2 right-2 bg-white/90 text-[10px] font-semibold px-2 py-1 rounded-md text-amber-600">
                        ★ {product.ratingAvg?.toFixed(1)}
                    </span>
                )}
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5em]">{product.Product_name}</h3>
                <p className="text-indigo-600 font-bold text-sm sm:text-base mt-1">
                    ₹{Number(product.Product_Price).toLocaleString('en-IN')}
                </p>
                <div className="mt-auto pt-2 space-y-1.5">
                    <button
                        onClick={handleBuyNow}
                        disabled={outOfStock}
                        className="w-full py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-all duration-200"
                    >
                        {outOfStock ? 'Unavailable' : '⚡ Buy Now'}
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={!user || outOfStock}
                        title={!user ? 'Login to add items to cart' : ''}
                        className={`w-full py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            !user || outOfStock
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                : added
                                ? 'bg-green-500 text-white'
                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}
                    >
                        {!user ? '🔒 Login to Add' : added ? '✓ Added!' : '+ Add to Cart'}
                    </button>
                </div>
            </div>
        </NavLink>
    )
}

export default ProductCard
