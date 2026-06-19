import { useState, useEffect } from 'react'

const StarRating = ({ value, onChange, readOnly = false }) => {
    const [hover, setHover] = useState(0)
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    className={`text-xl transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
                        star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                >★</button>
            ))}
        </div>
    )
}

const ReviewSection = ({ productId, currentUser }) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchReviews = async () => {
        try {
            const res = await fetch(`https://ecom-backend-ovxs.vercel.app/reviews/${productId}`)
            const data = await res.json()
            if (data.success) setReviews(data.reviews)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const handleSubmit = async () => {
        if (!rating) { setError('Please select a rating'); return }
        if (!comment.trim()) { setError('Please write a comment'); return }
        setError('')
        setSubmitting(true)
        try {
            const res = await fetch(`https://ecom-backend-ovxs.vercel.app/reviews/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ rating, comment })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess('Review added!')
                setRating(0)
                setComment('')
                fetchReviews()
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError(data.message)
            }
        } catch {
            setError('Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (reviewId) => {
        if (!confirm('Delete this review?')) return
        try {
            const res = await fetch(`https://ecom-backend-ovxs.vercel.app/reviews/${reviewId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) fetchReviews()
            else alert(data.message)
        } catch {
            alert('Failed to delete review')
        }
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null

    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">
                    Customer Reviews
                    <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
                </h3>
                {avgRating && (
                    <div className="flex items-center gap-1">
                        <StarRating value={Math.round(avgRating)} readOnly />
                        <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                    </div>
                )}
            </div>

            {/* Add Review Form */}
            {currentUser ? (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Write a Review</p>
                    <div className="mb-2">
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={3}
                        placeholder="Share your experience..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    {success && <p className="text-green-500 text-xs mt-1">{success}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="mt-2 bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                    Please <a href="/login" className="text-indigo-500 underline">log in</a> to write a review.
                </p>
            )}

            {/* Reviews List */}
            {loading ? (
                <p className="text-sm text-gray-400 text-center py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
            ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {reviews.map(r => (
                        <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                                        {r.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{r.username}</p>
                                        <StarRating value={r.rating} readOnly />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-gray-400">
                                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    {currentUser && currentUser.id === r.userId && (
                                        <button
                                            onClick={() => handleDelete(r._id)}
                                            className="text-xs text-red-400 hover:text-red-600 transition"
                                            title="Delete review"
                                        >🗑</button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-10">{r.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewSection
