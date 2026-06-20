import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import BuyNowModal from '../components/BuyNowModal'
import { productApi } from '../api/product.api'
import { categoryApi } from '../api/category.api'

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Top Rated' },
    { value: 'name_asc', label: 'Name: A to Z' },
]

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [buyNowProduct, setBuyNowProduct] = useState(null)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = Number(searchParams.get('page') || 1)

    useEffect(() => {
        categoryApi.getAll().then(res => {
            if (res.data.success) setCategories(res.data.categories.filter(c => c.status === 'active'))
        }).catch(() => {})
    }, [])

    useEffect(() => {
        setLoading(true)
        setError(null)
        productApi.getAll({
            search: search || undefined,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            sort,
            page,
            limit: 12,
        })
            .then(res => {
                if (res.data.success) {
                    setProducts(res.data.products)
                    setPagination(res.data.pagination)
                } else {
                    setError('Failed to load products')
                }
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false))
    }, [search, category, minPrice, maxPrice, sort, page])

    const updateParam = useCallback((key, value) => {
        const next = new URLSearchParams(searchParams)
        if (value) next.set(key, value)
        else next.delete(key)
        next.delete('page')
        setSearchParams(next)
    }, [searchParams, setSearchParams])

    const goToPage = (p) => {
        const next = new URLSearchParams(searchParams)
        next.set('page', p)
        setSearchParams(next)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const clearFilters = () => setSearchParams({})

    const hasActiveFilters = category || minPrice || maxPrice || sort !== 'newest'

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {search ? <>Search Results <span className="text-indigo-500">"{search}"</span></> : 'All Products'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">{pagination.total ?? products.length} items found</p>
                </div>
                <button
                    onClick={() => setFiltersOpen(o => !o)}
                    className="sm:hidden flex items-center gap-2 text-sm font-medium border border-gray-200 px-4 py-2 rounded-xl"
                >
                    ⚙️ Filters
                </button>
            </div>

            <div className="flex gap-6">
                {/* Sidebar filters */}
                <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0 space-y-6`}>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                        <div className="space-y-1.5">
                            <button
                                onClick={() => updateParam('category', '')}
                                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${!category ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => updateParam('category', cat._id)}
                                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition truncate ${category === cat._id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range (₹)</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                defaultValue={minPrice}
                                onBlur={e => updateParam('minPrice', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <span className="text-gray-400">—</span>
                            <input
                                type="number"
                                placeholder="Max"
                                defaultValue={maxPrice}
                                onBlur={e => updateParam('maxPrice', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">
                            Clear all filters
                        </button>
                    )}
                </aside>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-end mb-4">
                        <select
                            value={sort}
                            onChange={e => updateParam('sort', e.target.value)}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-gray-500">
                            <span className="text-5xl block mb-4">⚠️</span>
                            <p className="text-lg">{error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <span className="text-5xl block mb-4">📦</span>
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} onBuyNow={setBuyNowProduct} />
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => goToPage(page - 1)}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                    >
                                        ← Prev
                                    </button>
                                    <span className="text-sm text-gray-500 px-2">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <button
                                        disabled={page >= pagination.totalPages}
                                        onClick={() => goToPage(page + 1)}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {buyNowProduct && (
                <BuyNowModal product={buyNowProduct} onClose={() => setBuyNowProduct(null)} />
            )}
        </div>
    )
}

export default Shop
