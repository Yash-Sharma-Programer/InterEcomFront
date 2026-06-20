import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import BuyNowModal from '../components/BuyNowModal'
import { categoryApi } from '../api/category.api'

const CategoryPage = () => {
    const { id } = useParams()
    const [category, setCategory] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [buyNowProduct, setBuyNowProduct] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        categoryApi.getProducts(id)
            .then(res => {
                if (res.data.success) {
                    setCategory(res.data.category)
                    setProducts(res.data.products)
                } else {
                    setError('Category not found')
                }
            })
            .catch(() => setError('Could not load this category'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-24 text-gray-500">
                <span className="text-5xl block mb-4">⚠️</span>
                <p className="text-lg">{error}</p>
                <NavLink to="/shop" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Browse all products</NavLink>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                {category?.image && (
                    <img src={category.image} alt={category.name} className="w-16 h-16 rounded-2xl object-cover border border-gray-100" />
                )}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{category?.name}</h1>
                    {category?.description && <p className="text-sm text-gray-500 mt-1">{category.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{products.length} products</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <span className="text-5xl block mb-4">📦</span>
                    <p className="text-lg font-medium">No products in this category yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} onBuyNow={setBuyNowProduct} />
                    ))}
                </div>
            )}

            {buyNowProduct && (
                <BuyNowModal product={buyNowProduct} onClose={() => setBuyNowProduct(null)} />
            )}
        </div>
    )
}

export default CategoryPage
