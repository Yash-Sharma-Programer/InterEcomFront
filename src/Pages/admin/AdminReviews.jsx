import { useEffect, useState } from 'react'
import { reviewApi } from '../../api/review.api'
import StarRating from '../../components/StarRating'
import { toast } from 'react-toastify'

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
}

const AdminReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState('pending')
    const [actingId, setActingId] = useState(null)

    const fetchReviews = () => {
        setLoading(true)
        setError('')
        reviewApi.getAll({ status: statusFilter !== 'all' ? statusFilter : undefined })
            .then(res => { if (res.data.success) setReviews(res.data.reviews) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchReviews() }, [statusFilter])

    const handleStatusChange = async (id, status) => {
        setActingId(id)
        try {
            const res = await reviewApi.updateStatus(id, status)
            if (res.data.success) {
                toast.success(`Review ${status}`)
                setReviews(prev => prev.filter(r => r._id !== id || statusFilter === 'all'))
                if (statusFilter === 'all') {
                    setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r))
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update review')
        } finally {
            setActingId(null)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this review? This cannot be undone.')) return
        setActingId(id)
        try {
            const res = await reviewApi.remove(id)
            if (res.data.success) {
                toast.success('Review deleted')
                setReviews(prev => prev.filter(r => r._id !== id))
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete review')
        } finally {
            setActingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Reviews</h1>
                <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                {['pending', 'approved', 'rejected', 'all'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${statusFilter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-center py-16 text-gray-400">{error}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center py-16 text-gray-400">No reviews found</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {reviews.map(r => (
                            <div key={r._id} className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="font-semibold text-sm text-gray-800">{r.username}</span>
                                        <span className="text-xs text-gray-400">on</span>
                                        <span className="text-xs font-medium text-indigo-600 truncate max-w-[200px]">{r.product?.Product_name || 'Unknown product'}</span>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${statusStyles[r.status]}`}>
                                            {r.status}
                                        </span>
                                    </div>
                                    <StarRating value={r.rating} size="text-sm" />
                                    <p className="text-sm text-gray-600 mt-1">{r.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {r.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(r._id, 'approved')}
                                            disabled={actingId === r._id}
                                            className="text-xs font-medium text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {r.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleStatusChange(r._id, 'rejected')}
                                            disabled={actingId === r._id}
                                            className="text-xs font-medium text-orange-500 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(r._id)}
                                        disabled={actingId === r._id}
                                        className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminReviews
