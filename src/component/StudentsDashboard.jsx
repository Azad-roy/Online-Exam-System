import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    LogOut,
    Clock,
    BookOpen,
    User,
    ChevronLeft,
    ChevronRight,
    Play,
    Calendar,
    Award,
    Menu,
    X,
    Search
} from 'lucide-react';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (currentUser.role !== 'student') {
            navigate('/dashboard');
            return;
        }

        setUser(currentUser);
        loadQuizzes();
    }, [navigate]);

    // Load quizzes from teacher-created quizzes ONLY
    const loadQuizzes = () => {
        try {
            // Load quizzes created by teachers from localStorage
            const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');

            // Transform teacher quizzes to match student dashboard format
            const transformedQuizzes = teacherQuizzes.map(quiz => ({
                id: quiz.id,
                title: quiz.title,
                description: quiz.description,
                duration: quiz.duration,
                questionsCount: quiz.questions.length,
                difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
                category: quiz.category,
                attempts: Math.floor(Math.random() * 1000) + 500, // Random attempts for demo
                rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Random rating 4.5-5.0
                lastUpdated: new Date().toISOString().split('T')[0]
            }));

            setQuizzes(transformedQuizzes);
        } catch (error) {
            console.error('Error loading quizzes:', error);
            setQuizzes([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const startQuiz = (quiz) => {
        // Navigate to quiz attempt page with actual quiz data
        navigate('/quiz-attempt', {
            state: {
                quiz: quiz // This contains the actual teacher-created quiz
            }
        });
    };

    // Mock user stats
    const userStats = {
        completedQuizzes: quizzes.length > 0 ? Math.floor(Math.random() * quizzes.length) : 0,
        averageScore: quizzes.length > 0 ? Math.floor(Math.random() * 30) + 70 : 0,
        totalTimeSpent: quizzes.length > 0 ? `${Math.floor(Math.random() * 20) + 10}h ${Math.floor(Math.random() * 60)}m` : "0h 0m",
        currentStreak: quizzes.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-gray-800">ExamPro</span>
                                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full mt-1">
                                    Student Portal
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'quizzes', icon: FileText, label: 'My Quizzes' },
                            { id: 'results', icon: BarChart3, label: 'My Results' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'dashboard' && 'Dashboard'}
                                {activeTab === 'quizzes' && 'My Quizzes'}
                                {activeTab === 'results' && 'My Results'}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">Student</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Welcome Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-2">
                                    Welcome back, {user.name.split(' ')[0]}! 👋
                                </h2>
                                <p className="text-blue-100 mb-6">
                                    {quizzes.length > 0
                                        ? `Continue your learning journey. You have ${quizzes.length} quizzes available.`
                                        : 'No quizzes available yet. Please check back later when teachers create quizzes.'
                                    }
                                </p>
                                {quizzes.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('quizzes')}
                                        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        Browse Quizzes
                                    </button>
                                )}
                            </div>

                            {/* Stats Grid - Only show if there are quizzes */}
                            {quizzes.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600">Completed Quizzes</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                                    {userStats.completedQuizzes}
                                                </p>
                                            </div>
                                            <div className="bg-green-100 p-3 rounded-lg">
                                                <Award className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600">Average Score</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                                    {userStats.averageScore}%
                                                </p>
                                            </div>
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600">Time Spent</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                                    {userStats.totalTimeSpent}
                                                </p>
                                            </div>
                                            <div className="bg-purple-100 p-3 rounded-lg">
                                                <Clock className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600">Current Streak</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                                    {userStats.currentStreak} days
                                                </p>
                                            </div>
                                            <div className="bg-orange-100 p-3 rounded-lg">
                                                <Calendar className="w-6 h-6 text-orange-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Quizzes */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {quizzes.length > 0 ? 'Recommended Quizzes' : 'Available Quizzes'}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        {quizzes.length > 0
                                            ? 'Based on your learning progress'
                                            : 'No quizzes have been created by teachers yet'
                                        }
                                    </p>
                                </div>
                                <div className="p-6">
                                    {quizzes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Available</h3>
                                            <p className="text-gray-500 mb-6">
                                                There are no quizzes available at the moment.
                                                Please check back later when teachers create new quizzes.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {quizzes.slice(0, 2).map((quiz) => (
                                                <div key={quiz.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                                                {quiz.category}
                                                            </span>
                                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ml-2 ${quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                                quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {quiz.difficulty}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-orange-500">
                                                            <Award className="w-4 h-4 fill-current" />
                                                            <span className="text-sm font-medium">{quiz.rating}</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{quiz.duration} min</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <FileText className="w-4 h-4" />
                                                            <span>{quiz.questionsCount} questions</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => startQuiz(quiz)}
                                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        <span>Start Quiz</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Available Quizzes</h2>
                                    <p className="text-gray-600 mt-1">
                                        {quizzes.length > 0
                                            ? 'Test your knowledge with these curated quizzes'
                                            : 'No quizzes available from teachers'
                                        }
                                    </p>
                                </div>
                                {quizzes.length > 0 && (
                                    <div className="flex items-center space-x-4">
                                        <select className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option>All Categories</option>
                                            <option>Programming</option>
                                            <option>Web Development</option>
                                            <option>Database</option>
                                            <option>Computer Science</option>
                                        </select>
                                        <select className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option>All Difficulty</option>
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                                    <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Quizzes Available</h3>
                                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                                        There are no quizzes available at the moment. Teachers haven't created any quizzes yet.
                                        Please check back later when new quizzes are added to the system.
                                    </p>
                                    <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {quizzes.map((quiz) => (
                                        <div key={quiz.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                                            {quiz.category}
                                                        </span>
                                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ml-2 ${quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                            quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {quiz.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-orange-500">
                                                        <Award className="w-4 h-4 fill-current" />
                                                        <span className="text-sm font-medium">{quiz.rating}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                                                <p className="text-gray-600 mb-4">{quiz.description}</p>

                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{quiz.duration} min</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FileText className="w-4 h-4" />
                                                        <span>{quiz.questionsCount} questions</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                    <span>{quiz.attempts.toLocaleString()} attempts</span>
                                                    <span>Updated: {quiz.lastUpdated}</span>
                                                </div>

                                                <button
                                                    onClick={() => startQuiz(quiz)}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    <span>Start Quiz</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Results</h3>
                                <p className="text-gray-600 mb-6">
                                    {quizzes.length > 0
                                        ? 'Your quiz results and performance analytics will appear here after you complete some quizzes. Start by taking your first quiz from the "My Quizzes" section!'
                                        : 'No quizzes available yet. Please check back when teachers create quizzes.'
                                    }
                                </p>
                                {quizzes.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('quizzes')}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                                    >
                                        Browse Quizzes
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;