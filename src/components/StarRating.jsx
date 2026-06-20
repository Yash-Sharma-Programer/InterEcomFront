const StarRating = ({ value = 0, size = 'text-base', onChange }) => {
    const stars = [1, 2, 3, 4, 5]
    const interactive = typeof onChange === 'function'

    return (
        <div className={`flex items-center gap-0.5 ${size}`}>
            {stars.map(star => (
                <span
                    key={star}
                    onClick={() => interactive && onChange(star)}
                    className={`${interactive ? 'cursor-pointer' : ''} ${star <= Math.round(value) ? 'text-amber-400' : 'text-gray-200'}`}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

export default StarRating
