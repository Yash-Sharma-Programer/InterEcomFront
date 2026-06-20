import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { productApi } from '../../api/product.api'
import { categoryApi } from '../../api/category.api'
import { toast } from 'react-toastify'

const AdminProducts = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [deletingId, setDeletingId] = useState(null)

    const fetchProducts = () => {
        setLoading(true)
        setError('')
        productApi.getAll({ search: search || undefined, category: categoryFilter || undefined, includeInactive: true, limit: 50 })
            .then(res => {
                if (res.data.success) setProducts(res.data.products)
                else setError('Failed to load products')
            })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        categoryApi.getAll().then(res => { if (res.data.success) setCategories(res.data.categories) }).catch(() => {})
    }, [])

    useEffect(() => {
        const t = setTimeout(fetchProducts, 300)
        return () => clearTimeout(t)
    }, [search, categoryFilter])

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
        setDeletingId(id)
        try {
            const res = await productApi.remove(id)
            if (res.data.success) {
                toast.success('Product deleted')
                setProducts(prev => prev.filter(p => p._id !== id))
            } else {
                toast.error(res.data.message || 'Failed to delete')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    + Add Product
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-center py-16 text-gray-400">{error}</p>
                ) : products.length === 0 ? (
                    <p className="text-center py-16 text-gray-400">No products found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Image</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Name</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Category</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Price</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Stock</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Status</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                        <td className="px-4 sm:px-6 py-3">
                                            <img
                                                src={p.images?.[0] || p.Product_URl}
                                                alt={p.Product_name}
                                                className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100"
                                                onError={e => e.target.src = 'https://via.placeholder.com/48?text=?'}
                                            />
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 font-medium text-gray-800 max-w-[180px] truncate">{p.Product_name}</td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-500">{p.category?.name || '—'}</td>
                                        <td className="px-4 sm:px-6 py-3 font-bold text-indigo-600">₹{Number(p.Product_Price).toLocaleString('en-IN')}</td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-500">{p.stock ?? 0}</td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${p.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id, p.Product_name)}
                                                    disabled={deletingId === p._id}
                                                    className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    {deletingId === p._id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminProducts
