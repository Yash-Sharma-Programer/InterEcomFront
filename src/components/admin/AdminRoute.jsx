import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
    const { user, authLoading, isAdmin } = useAuth()

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (!user || !isAdmin) {
        return <Navigate to="/adminlogin" replace />
    }

    return children
}

export default AdminRoute
