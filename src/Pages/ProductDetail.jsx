import { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { productApi } from '../api/product.api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import BuyNowModal from '../components/BuyNowModal'
import ReviewSection from '../components/ReviewSection'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const { user } = useAuth()
    const { isInWishlist, toggleWishlist } = useWishlist()

    const [product, setProduct] = useState(null)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const [qty, setQty] = useState(1)
    const [buyNowOpen, setBuyNowOpen] = useState(false)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)
        setActiveImage(0)
        setQty(1)
        productApi.getById(id)
            .then(res => {
                if (res.data.success) {
                    setProduct(res.data.product)
                    setRelated(res.data.relatedProducts || [])
                } else {
                    setError('Product not found')
                }
            })
            .catch(() => setError('Could not load this product'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="text-center py-24 text-gray-500">
                <span className="text-5xl block mb-4">⚠️</span>
                <p className="text-lg">{error || 'Product not found'}</p>
                <NavLink to="/shop" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Browse all products</NavLink>
            </div>
        )
    }

    const images = product.images?.length > 0 ? product.images : [product.Product_URl]
    const outOfStock = product.stock !== undefined && product.stock <= 0
    const inWishlist = isInWishlist(product._id)

    const handleAddToCart = () => {
        if (!user) { navigate('/login'); return }
        addToCart(product, qty)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    const handleBuyNow = () => {
        if (!user) { navigate('/login'); return }
        setBuyNowOpen(true)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                {/* Image gallery */}
                <div>
                    <div className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center mb-3">
                        <img
                            src={images[activeImage]}
                            alt={product.Product_name}
                            className="w-full h-full object-contain p-6"
                            onError={e => e.target.src = 'https://via.placeholder.com/400?text=No+Image'}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden ${activeImage === i ? 'border-indigo-500' : 'border-gray-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    {product.category?.name && (
                        <NavLink to={`/category/${product.category._id}`} className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                            {product.category.name}
                        </NavLink>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 mb-2">{product.Product_name}</h1>

                    {product.ratingCount > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                            <StarRating value={product.ratingAvg} />
                            <span className="text-sm text-gray-500">{product.ratingAvg?.toFixed(1)} ({product.ratingCount} reviews)</span>
                        </div>
                    )}

                    <p className="text-3xl font-bold text-indigo-600 mb-4">₹{Number(product.Product_Price).toLocaleString('en-IN')}</p>

                    {product.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>
                    )}

                    <p className={`text-sm font-medium mb-5 ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
                        {outOfStock ? '✗ Out of Stock' : `✓ In Stock${product.stock !== undefined ? ` (${product.stock} available)` : ''}`}
                    </p>

                    {!outOfStock && (
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-sm font-medium text-gray-700">Quantity</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">−</button>
                                <span className="w-8 text-center font-semibold">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock ?? 99, q + 1))} className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold">+</button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleBuyNow}
                            disabled={outOfStock}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-semibold transition"
                        >
                            ⚡ Buy Now
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={outOfStock}
                            className={`flex-1 py-3 rounded-xl font-semibold transition border ${added ? 'bg-green-500 text-white border-green-500' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'} disabled:opacity-50`}
                        >
                            {added ? '✓ Added!' : '+ Add to Cart'}
                        </button>
                        <button
                            onClick={() => toggleWishlist(product._id)}
                            className={`px-4 py-3 rounded-xl font-semibold transition border ${inWishlist ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'}`}
                        >
                            {inWishlist ? '♥' : '♡'}
                        </button>
                    </div>
                </div>
            </div>

            <ReviewSection productId={product._id} />

            {related.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5">Related Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {related.map(p => (
                            <ProductCard key={p._id} product={p} onBuyNow={() => navigate(`/product/${p._id}`)} />
                        ))}
                    </div>
                </div>
            )}

            {buyNowOpen && (
                <BuyNowModal product={{ ...product, Product_URl: images[0] }} onClose={() => setBuyNowOpen(false)} />
            )}
        </div>
    )
}

export default ProductDetail
