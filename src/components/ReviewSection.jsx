import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { reviewApi } from '../api/review.api'
import { toast } from 'react-toastify'
import StarRating from './StarRating'

const ReviewSection = ({ productId }) => {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(0)
    const [text, setText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchReviews = () => {
        setLoading(true)
        reviewApi.getForProduct(productId)
            .then(res => { if (res.data.success) setReviews(res.data.reviews) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) { toast.info('Log in to write a review'); return }
        if (rating === 0) { toast.error('Please select a rating'); return }
        if (!text.trim()) { toast.error('Please write your review'); return }

        setSubmitting(true)
        try {
            const res = await reviewApi.submit({ productId, rating, text })
            if (res.data.success) {
                toast.success(res.data.message || 'Review submitted for approval')
                setRating(0)
                setText('')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not submit review')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5">Customer Reviews</h2>

            {/* Review form */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <StarRating value={rating} onChange={setRating} size="text-2xl" />
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={user ? "Share your experience with this product..." : "Log in to write a review"}
                        disabled={!user}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!user || submitting}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>

            {/* Reviews list */}
            {loading ? (
                <p className="text-sm text-gray-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-400">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-sm text-gray-800">{review.username}</span>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <StarRating value={review.rating} size="text-sm" />
                            <p className="text-sm text-gray-600 mt-2">{review.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewSection
