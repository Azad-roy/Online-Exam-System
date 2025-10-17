import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
    Award,
    CheckCircle2,
    XCircle,
    Clock,
    BarChart3,
    RefreshCw,
    LayoutDashboard,
    Home,
    Calendar,
    Star,
    Trophy,
    TrendingUp,
    BookOpen,
    User
} from 'lucide-react';

const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state) {
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    const resultData = location.state || {
        score: 0,
        totalQuestions: 5,
        quizTitle: "Quiz",
        timeSpent: "00:00",
        correctAnswers: 0,
        incorrectAnswers: 5,
        quizId: 1
    };

    const {
        score,
        totalQuestions,
        quizTitle,
        timeSpent,
        correctAnswers,
        incorrectAnswers,
        quizId
    } = resultData;

    const percentage = Math.round((score / totalQuestions) * 100);

    const handleRetake = () => {
        // Load the actual teacher-created quiz from localStorage
        const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
        const quizToRetake = teacherQuizzes.find(quiz => quiz.id == quizId); // Use == for string/number comparison

        if (quizToRetake) {
            // Transform to student dashboard format
            const studentQuiz = {
                id: quizToRetake.id,
                title: quizToRetake.title,
                description: quizToRetake.description,
                duration: quizToRetake.duration,
                questionsCount: quizToRetake.questions.length,
                difficulty: quizToRetake.difficulty.charAt(0).toUpperCase() + quizToRetake.difficulty.slice(1),
                category: quizToRetake.category
            };

            navigate('/quiz-attempt', {
                state: {
                    quiz: studentQuiz
                }
            });
        } else {
            // Fallback: navigate to dashboard if quiz not found
            alert('Quiz not found. Returning to dashboard.');
            navigate('/dashboard');
        }
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    const handleHome = () => {
        navigate('/');
    };

    const getFeedback = () => {
        if (percentage >= 90) return {
            message: "Outstanding! 🎉",
            description: "You've mastered this material!",
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-200",
            icon: <Trophy className="w-8 h-8" />
        };
        if (percentage >= 80) return {
            message: "Excellent Work! 👏",
            description: "Great understanding of the concepts!",
            color: "text-green-500",
            bg: "bg-green-50",
            border: "border-green-200",
            icon: <Award className="w-8 h-8" />
        };
        if (percentage >= 70) return {
            message: "Good Job! 💪",
            description: "Solid performance, keep it up!",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: <TrendingUp className="w-8 h-8" />
        };
        if (percentage >= 60) return {
            message: "Not Bad! 📚",
            description: "Good effort, some room for improvement",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            icon: <BookOpen className="w-8 h-8" />
        };
        return {
            message: "Keep Practicing! 🎯",
            description: "Review the material and try again",
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
            icon: <RefreshCw className="w-8 h-8" />
        };
    };

    const feedback = getFeedback();

    // Load quiz history for the sidebar
    const loadQuizHistory = () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return [];

            const userResults = JSON.parse(localStorage.getItem('userResults') || '[]');
            const userHistory = userResults
                .filter(result => result.userId === currentUser.id)
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .slice(0, 5);

            return userHistory;
        } catch (error) {
            console.error('Error loading quiz history:', error);
            return [];
        }
    };

    const quizHistory = loadQuizHistory();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPerformanceColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 80) return 'text-green-500 bg-green-100';
        if (percentage >= 70) return 'text-blue-600 bg-blue-100';
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">ExamPro</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">Student</p>
                            <p className="text-sm text-gray-500">Results</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Result Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                                <p className="text-gray-600">You have completed: <strong>{quizTitle}</strong></p>
                            </div>

                            {/* Score Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{score}/{totalQuestions}</div>
                                    <div className="text-gray-600">Correct Answers</div>
                                </div>
                                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{percentage}%</div>
                                    <div className="text-gray-600">Overall Score</div>
                                </div>
                                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{timeSpent}</div>
                                    <div className="text-gray-600">Time Spent</div>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className={`p-6 rounded-xl mb-8 text-center border-2 ${feedback.border} ${feedback.bg}`}>
                                <div className="flex items-center justify-center space-x-3 mb-3">
                                    <div className={feedback.color}>
                                        {feedback.icon}
                                    </div>
                                    <h3 className={`text-2xl font-bold ${feedback.color}`}>
                                        {feedback.message}
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    {feedback.description}
                                </p>
                            </div>

                            {/* Performance Breakdown */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Performance Breakdown
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Correct Answers</span>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="font-semibold">{correctAnswers}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Incorrect Answers</span>
                                        <div className="flex items-center space-x-2">
                                            <XCircle className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold">{incorrectAnswers}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Time Spent</span>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-5 h-5 text-purple-500" />
                                            <span className="font-semibold">{timeSpent}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                        Overall Performance: {percentage}%
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleRetake}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    <span>Retake Quiz</span>
                                </button>
                                <button
                                    onClick={handleDashboard}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center space-x-2"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Go to Dashboard</span>
                                </button>
                            </div>

                            {/* Home Button */}
                            <div className="mt-6">
                                <button
                                    onClick={handleHome}
                                    className="w-full border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                                >
                                    <Home className="w-5 h-5" />
                                    <span>Back to Home</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quiz History Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                                Quiz History
                            </h3>

                            {quizHistory.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-2">No quiz history yet</p>
                                    <p className="text-sm text-gray-400">Complete more quizzes to see your history here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {quizHistory.map((attempt, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                                    {attempt.quizTitle}
                                                </h4>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(attempt.percentage)}`}>
                                                    {attempt.percentage}%
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    <span>{attempt.score}/{attempt.totalQuestions}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3 text-purple-500" />
                                                    <span>{attempt.timeSpent}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(attempt.submittedAt)}</span>
                                                </div>
                                                {attempt.percentage >= 80 && (
                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Statistics Summary */}
                            {quizHistory.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Summary</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                                            <div className="font-bold text-blue-600">{quizHistory.length}</div>
                                            <div className="text-gray-600">Total Attempts</div>
                                        </div>
                                        <div className="text-center p-2 bg-green-50 rounded-lg">
                                            <div className="font-bold text-green-600">
                                                {Math.round(quizHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizHistory.length)}%
                                            </div>
                                            <div className="text-gray-600">Average Score</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Your result has been saved to your profile. You can review your performance anytime from your dashboard.</p>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;