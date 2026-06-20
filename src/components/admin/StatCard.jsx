const StatCard = ({ icon, label, value, sub, color = 'bg-indigo-50' }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex items-center gap-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 ${color}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
        </div>
    </div>
)

export default StatCard
