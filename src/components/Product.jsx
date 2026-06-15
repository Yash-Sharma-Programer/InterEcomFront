import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import BuyNowModal from './BuyNowModal'

const Product = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [added, setAdded] = useState({})
    const [buyNowProduct, setBuyNowProduct] = useState(null)
    const { addToCart } = useCart()
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    useEffect(() => {
        setLoading(true)
        setError(null)

        const url = searchQuery
            ? `http://localhost:3000/products?search=${encodeURIComponent(searchQuery)}`
            : 'http://localhost:3000/products'

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.products)
                else setError("Failed to load products")
            })
            .catch(() => setError("Could not connect to server"))
            .finally(() => setLoading(false))
    }, [searchQuery])

    const handleAddToCart = (product) => {
        addToCart(product)
        setAdded(prev => ({ ...prev, [product._id]: true }))
        setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500)
    }

    if (loading) return (
        <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
    )

    if (error) return (
        <div className="text-center py-20 text-gray-500">
            <span className="text-5xl block mb-4">⚠️</span>
            <p className="text-lg">{error}</p>
            <p className="text-sm mt-2">Make sure the backend is running on port 3000</p>
        </div>
    )

    return (
        <>
            <section id="products" className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {searchQuery ? (
                                <>Search Results <span className="text-indigo-500">"{searchQuery}"</span></>
                            ) : 'All Products'}
                            <span className="ml-3 text-sm font-normal text-gray-400">({products.length} items)</span>
                        </h2>
                        {searchQuery && products.length === 0 && (
                            <p className="text-gray-500 text-sm mt-1">No products found for your search.</p>
                        )}
                    </div>
                </div>

                {products.length === 0 && !searchQuery ? (
                    <div className="text-center py-20 text-gray-500">
                        <span className="text-5xl block mb-4">📦</span>
                        <p className="text-lg font-medium">No products yet</p>
                        <p className="text-sm mt-1">Ask an admin to add some products!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map(product => (
                            <div
                                key={product._id}
                                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="relative overflow-hidden bg-gray-50 h-44">
                                    <img
                                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                        src={product.Product_URl}
                                        alt={product.Product_name}
                                        onError={e => e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 truncate">{product.Product_name}</h3>
                                    <p className="text-indigo-600 font-bold text-base mt-1">
                                        ₹{Number(product.Product_Price).toLocaleString('en-IN')}
                                    </p>
                                    {/* Buy Now */}
                                    <button
                                        onClick={() => setBuyNowProduct(product)}
                                        className="mt-3 w-full py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
                                    >
                                        ⚡ Buy Now
                                    </button>
                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className={`mt-2 w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                            added[product._id]
                                                ? 'bg-green-500 text-white'
                                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        }`}
                                    >
                                        {added[product._id] ? '✓ Added!' : '+ Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Buy Now Modal */}
            {buyNowProduct && (
                <BuyNowModal
                    product={buyNowProduct}
                    onClose={() => setBuyNowProduct(null)}
                />
            )}
        </>
    )
}

export default Product
