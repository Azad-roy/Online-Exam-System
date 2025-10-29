import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./component/LoginPage";
import SignupPage from "./component/SignupPage";
import OnlineExamSystem from "./component/OnlineExamSystem";
import StudentsDashboard from './component/StudentsDashboard';
import ResultPage from './component/ResultPage';
import AdminPanel from './component/AdminPanel';
import QuizAttempt from './component/QuizAttempt';
import TeacherPanel from './component/TeacherPanel';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnlineExamSystem />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-attempt"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-panel"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherPanel />
            </ProtectedRoute>
          }
        />
        {/* Fallback route for 404 pages */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;