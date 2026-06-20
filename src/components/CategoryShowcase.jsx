import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { categoryApi } from '../api/category.api'

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        categoryApi.getAll()
            .then(res => {
                if (res.data.success) {
                    setCategories(res.data.categories.filter(c => c.status === 'active'))
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-24 sm:w-32 shrink-0 h-28 sm:h-36 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (categories.length === 0) return null

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Shop by Category</h2>
                <NavLink to="/shop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all →</NavLink>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-6">
                {categories.map(cat => (
                    <NavLink
                        key={cat._id}
                        to={`/category/${cat._id}`}
                        className="group shrink-0 w-24 sm:w-auto flex flex-col items-center gap-2 text-center"
                    >
                        <div className="w-24 h-24 sm:w-full sm:h-28 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group-hover:shadow-md transition">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl">🛍</span>
                            )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-indigo-600 truncate w-full">{cat.name}</span>
                    </NavLink>
                ))}
            </div>
        </section>
    )
}

export default CategoryShowcase
