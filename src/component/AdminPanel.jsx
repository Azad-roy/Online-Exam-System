import { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    LogOut,
    Users,
    Settings,
    Plus,
    Edit,
    Trash2,
    Eye,
    Clock,
    XCircle,
    BookOpen,
    UserCheck
} from 'lucide-react';


const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddQuizForm, setShowAddQuizForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        description: '',
        duration: 30,
        questionsCount: 10,
        difficulty: 'beginner',
        category: ''
    });

    const quizzes = [
        { id: 1, title: "JavaScript Fundamentals", category: "Programming", difficulty: "Beginner", duration: 30, questionsCount: 10, participants: 150, avgScore: 78 },
        { id: 2, title: "React Advanced Concepts", category: "Web Development", difficulty: "Advanced", duration: 45, questionsCount: 15, participants: 89, avgScore: 72 },
        { id: 3, title: "Database Design", category: "Database", difficulty: "Intermediate", duration: 60, questionsCount: 20, participants: 120, avgScore: 85 },
    ];

    const userResults = [
        { id: 1, userName: "John Doe", quizTitle: "JavaScript Fundamentals", score: 8, total: 10, percentage: 80, timeSpent: "25:30", date: "2024-01-15" },
        { id: 2, userName: "Jane Smith", quizTitle: "React Advanced Concepts", score: 12, total: 15, percentage: 80, timeSpent: "38:45", date: "2024-01-14" },
        { id: 3, userName: "Mike Johnson", quizTitle: "Database Design", score: 18, total: 20, percentage: 90, timeSpent: "52:10", date: "2024-01-14" },
    ];

    const stats = {
        totalQuizzes: 15,
        totalUsers: 1250,
        avgCompletionRate: 78,
        totalAttempts: 3450
    };

    const handleAddQuiz = (e) => {
        e.preventDefault();
        console.log('Adding new quiz:', newQuiz);
        setShowAddQuizForm(false);
        setNewQuiz({
            title: '',
            description: '',
            duration: 30,
            questionsCount: 10,
            difficulty: 'beginner',
            category: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewQuiz(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-800">Exam System</span>
                            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1">
                                Admin Panel
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                        { id: 'quizzes', icon: FileText, label: 'Manage Quizzes' },
                        { id: 'results', icon: BarChart3, label: 'User Results' },
                        { id: 'users', icon: Users, label: 'User Management' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {activeTab === 'dashboard' && 'Admin Dashboard'}
                                {activeTab === 'quizzes' && 'Manage Quizzes'}
                                {activeTab === 'results' && 'User Results'}
                                {activeTab === 'users' && 'User Management'}
                                {activeTab === 'settings' && 'Settings'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {activeTab === 'dashboard' && 'Overview of platform statistics and performance'}
                                {activeTab === 'quizzes' && 'Create and manage all quizzes in the system'}
                                {activeTab === 'results' && 'View and analyze user performance data'}
                                {activeTab === 'users' && 'Manage user accounts and permissions'}
                                {activeTab === 'settings' && 'System configuration and preferences'}
                            </p>
                        </div>
                        {activeTab === 'quizzes' && (
                            <button
                                onClick={() => setShowAddQuizForm(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add New Quiz</span>
                            </button>
                        )}
                    </div>

                    {/* Admin Dashboard */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600">Total Quizzes</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalQuizzes}</p>
                                        </div>
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600">Total Users</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                                        </div>
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600">Avg. Completion</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgCompletionRate}%</p>
                                        </div>
                                        <div className="bg-orange-100 p-3 rounded-lg">
                                            <BarChart3 className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600">Total Attempts</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAttempts}</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <UserCheck className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Results */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">Recent Quiz Results</h2>
                                </div>
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 text-gray-600 font-semibold">User</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Quiz</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Score</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Time</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userResults.slice(0, 5).map((result) => (
                                                    <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-4 text-gray-900 font-medium">{result.userName}</td>
                                                        <td className="py-4 text-gray-600">{result.quizTitle}</td>
                                                        <td className="py-4">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.percentage >= 80 ? 'bg-green-100 text-green-700' :
                                                                    result.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                }`}>
                                                                {result.percentage}%
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-gray-600">{result.timeSpent}</td>
                                                        <td className="py-4 text-gray-600">{result.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Quizzes */}
                    {activeTab === 'quizzes' && (
                        <div className="space-y-6">
                            {/* Add Quiz Form Modal */}
                            {showAddQuizForm && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
                                        <div className="p-6 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
                                                <button
                                                    onClick={() => setShowAddQuizForm(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <XCircle className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                        <form onSubmit={handleAddQuiz} className="p-6 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Quiz Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={newQuiz.title}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="category"
                                                        value={newQuiz.category}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Duration (minutes)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="duration"
                                                        value={newQuiz.duration}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Number of Questions
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="questionsCount"
                                                        value={newQuiz.questionsCount}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        name="description"
                                                        value={newQuiz.description}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Difficulty Level
                                                    </label>
                                                    <select
                                                        name="difficulty"
                                                        value={newQuiz.difficulty}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="beginner">Beginner</option>
                                                        <option value="intermediate">Intermediate</option>
                                                        <option value="advanced">Advanced</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-4 pt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddQuizForm(false)}
                                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    <span>Create Quiz</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Quizzes List */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">All Quizzes ({quizzes.length})</h2>
                                </div>
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Quiz Title</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Category</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Difficulty</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Duration</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Participants</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Avg. Score</th>
                                                    <th className="text-left py-3 text-gray-600 font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {quizzes.map((quiz) => (
                                                    <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-4">
                                                            <div>
                                                                <div className="font-medium text-gray-900">{quiz.title}</div>
                                                                <div className="text-sm text-gray-500">{quiz.questionsCount} questions</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-gray-600">{quiz.category}</td>
                                                        <td className="py-4">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                                    quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                }`}>
                                                                {quiz.difficulty}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-gray-600">
                                                            <div className="flex items-center space-x-1">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{quiz.duration} min</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-gray-600">{quiz.participants}</td>
                                                        <td className="py-4">
                                                            <span className="font-medium text-gray-900">{quiz.avgScore}%</span>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="flex space-x-2">
                                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other tabs would go here... */}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;