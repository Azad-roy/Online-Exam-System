import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPages from "./component/AuthPages";
import OnlineExamSystem from "./component/OnlineExamSystem";
import StudentsDashboard from './component/StudentsDashboard';
import ResultPage from './component/ResultPage';
import AdminPanel from './component/AdminPanel';
import QuizAttempt from './component/QuizAttempt';
import TeacherPanel from './component/TeacherPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnlineExamSystem />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/dashboard" element={<StudentsDashboard />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/quiz-attempt" element={<QuizAttempt />} />
        <Route path="/teacher-panel" element={<TeacherPanel />} />
      </Routes>
    </Router>
  );
}

export default App;