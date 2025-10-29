// component/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        // Redirect to appropriate dashboard based on role
        if (currentUser.role === 'student') {
            return <Navigate to="/dashboard" replace />;
        } else if (currentUser.role === 'teacher') {
            return <Navigate to="/teacher-panel" replace />;
        } else if (currentUser.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;