import { NavLink } from 'react-router-dom'
import ProductCard from './ProductCard'

const ProductSection = ({ title, products, loading, viewAllLink, onBuyNow }) => {
    if (!loading && (!products || products.length === 0)) return null

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
                {viewAllLink && (
                    <NavLink to={viewAllLink} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all →</NavLink>
                )}
            </div>
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} onBuyNow={onBuyNow} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default ProductSection
