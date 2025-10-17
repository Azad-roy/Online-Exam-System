import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Plus,
    Edit,
    Trash2,
    Users,
    BarChart3,
    LogOut,
    BookOpen,
    User,
    Clock,
    X,
    Save,
    Eye,
    Settings,
    Menu,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';

const TeacherPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const initialQuizState = {
        id: '',
        title: '',
        description: '',
        duration: 30,
        category: '',
        difficulty: 'beginner',
        questions: [
            {
                id: 1,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0
            }
        ]
    };

    const [quizForm, setQuizForm] = useState(initialQuizState);

    // Check authentication and load data
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (!currentUser) {
            navigate('/auth');
            return;
        }

        if (currentUser.role !== 'teacher') {
            navigate('/dashboard');
            return;
        }

        setUser(currentUser);
        loadQuizzes();
        setIsLoading(false);
    }, [navigate]);

    // Load quizzes from localStorage
    const loadQuizzes = () => {
        try {
            const storedQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
            setQuizzes(storedQuizzes);
        } catch (error) {
            console.error('Error loading quizzes:', error);
            setQuizzes([]);
        }
    };

    // Save quizzes to localStorage
    const saveQuizzes = (updatedQuizzes) => {
        try {
            localStorage.setItem('teacherQuizzes', JSON.stringify(updatedQuizzes));
            setQuizzes(updatedQuizzes);
        } catch (error) {
            console.error('Error saving quizzes:', error);
        }
    };

    // Handle quiz form input changes
    const handleQuizFormChange = (e) => {
        const { name, value } = e.target;
        setQuizForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle question changes
    const handleQuestionChange = (questionIndex, field, value) => {
        setQuizForm(prev => ({
            ...prev,
            questions: prev.questions.map((question, index) =>
                index === questionIndex ? { ...question, [field]: value } : question
            )
        }));
    };

    // Handle option changes
    const handleOptionChange = (questionIndex, optionIndex, value) => {
        setQuizForm(prev => ({
            ...prev,
            questions: prev.questions.map((question, index) =>
                index === questionIndex
                    ? {
                        ...question,
                        options: question.options.map((opt, optIndex) =>
                            optIndex === optionIndex ? value : opt
                        )
                    }
                    : question
            )
        }));
    };

    // Add new question
    const addQuestion = () => {
        setQuizForm(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: prev.questions.length + 1,
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0
                }
            ]
        }));
    };

    // Remove question
    const removeQuestion = (questionIndex) => {
        if (quizForm.questions.length > 1) {
            setQuizForm(prev => ({
                ...prev,
                questions: prev.questions.filter((_, index) => index !== questionIndex)
            }));
        }
    };

    // Open quiz form for adding
    const openAddQuizForm = () => {
        setQuizForm({
            ...initialQuizState,
            id: Date.now().toString()
        });
        setEditingQuiz(null);
        setShowQuizForm(true);
        setSidebarOpen(false);
    };

    // Open quiz form for editing
    const openEditQuizForm = (quiz) => {
        setQuizForm(quiz);
        setEditingQuiz(quiz);
        setShowQuizForm(true);
        setSidebarOpen(false);
    };

    // Save quiz (create or update)
    const saveQuiz = () => {
        // Basic validation
        if (!quizForm.title.trim() || !quizForm.description.trim() || !quizForm.category.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate questions
        for (let question of quizForm.questions) {
            if (!question.question.trim()) {
                alert('Please fill in all questions');
                return;
            }
            for (let option of question.options) {
                if (!option.trim()) {
                    alert('Please fill in all options for each question');
                    return;
                }
            }
        }

        let updatedQuizzes;

        if (editingQuiz) {
            // Update existing quiz
            updatedQuizzes = quizzes.map(q => q.id === quizForm.id ? quizForm : q);
        } else {
            // Add new quiz
            updatedQuizzes = [...quizzes, quizForm];
        }

        saveQuizzes(updatedQuizzes);
        setShowQuizForm(false);
        setQuizForm(initialQuizState);
        setEditingQuiz(null);
    };

    // Delete quiz
    const deleteQuiz = (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
            saveQuizzes(updatedQuizzes);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/auth');
    };

    // Mock statistics
    const stats = {
        totalQuizzes: quizzes.length,
        totalStudents: 1250,
        totalAttempts: 3450,
        avgCompletionRate: 78
    };

    if (isLoading) {
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
                                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1">
                                    Teacher Panel
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
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'manage-quizzes', icon: FileText, label: 'Manage Quizzes' },
                            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
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
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {activeTab === 'dashboard' && 'Teacher Dashboard'}
                                {activeTab === 'manage-quizzes' && 'Manage Quizzes'}
                                {activeTab === 'analytics' && 'Analytics'}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-500">Teacher</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <button
                                onClick={openAddQuizForm}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Add Quiz</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 sm:space-y-8">
                            {/* Welcome Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
                                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                                    Welcome back, {user?.name.split(' ')[0]}! 👋
                                </h2>
                                <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                                    Manage your quizzes and track student performance from your teacher dashboard.
                                </p>
                                <button
                                    onClick={openAddQuizForm}
                                    className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
                                >
                                    Create New Quiz
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm sm:text-base">Total Quizzes</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                                {stats.totalQuizzes}
                                            </p>
                                        </div>
                                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm sm:text-base">Total Students</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                                {stats.totalStudents}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm sm:text-base">Total Attempts</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                                {stats.totalAttempts.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                                            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm sm:text-base">Avg. Completion</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                                {stats.avgCompletionRate}%
                                            </p>
                                        </div>
                                        <div className="bg-orange-100 p-2 sm:p-3 rounded-lg">
                                            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Quizzes */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Quizzes</h2>
                                            <p className="text-gray-600 text-sm sm:text-base mt-1">Recently created quizzes</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('manage-quizzes')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm sm:text-base"
                                        >
                                            View All Quizzes
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6">
                                    {quizzes.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2 text-sm sm:text-base">No quizzes created yet</p>
                                            <p className="text-xs sm:text-sm text-gray-400">Create your first quiz to get started</p>
                                            <button
                                                onClick={openAddQuizForm}
                                                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base"
                                            >
                                                Create First Quiz
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            {quizzes.slice(0, 6).map((quiz) => (
                                                <div key={quiz.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                                            <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                                                {quiz.category}
                                                            </span>
                                                            <span className={`inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                                                quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {quiz.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h3>
                                                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{quiz.description}</p>

                                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>{quiz.duration} min</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>{quiz.questions.length} questions</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditQuizForm(quiz)}
                                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                                                        >
                                                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteQuiz(quiz.id)}
                                                            className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                                                        >
                                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Quizzes Tab */}
                    {activeTab === 'manage-quizzes' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Available Quizzes</h2>
                                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                                        {quizzes.length > 0
                                            ? 'Manage and organize your quiz library'
                                            : 'No quizzes available yet'
                                        }
                                    </p>
                                </div>
                                {quizzes.length > 0 && (
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                                            <option>All Categories</option>
                                            <option>Programming</option>
                                            <option>Mathematics</option>
                                            <option>Science</option>
                                            <option>History</option>
                                        </select>
                                        <select className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base">
                                            <option>All Difficulty</option>
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
                                    <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No Quizzes Available</h3>
                                    <p className="text-gray-600 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
                                        There are no quizzes available at the moment. Create your first quiz to get started.
                                    </p>
                                    <button
                                        onClick={openAddQuizForm}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base"
                                    >
                                        Create Your First Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                    <div className="p-4 sm:p-6 border-b border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Quizzes</h2>
                                                <p className="text-gray-600 text-sm sm:text-base mt-1">Manage and organize your quiz library</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base">Quiz Title</th>
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base hidden sm:table-cell">Category</th>
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base">Difficulty</th>
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base hidden md:table-cell">Duration</th>
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base hidden lg:table-cell">Questions</th>
                                                        <th className="text-left py-3 text-gray-600 font-semibold text-sm sm:text-base">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {quizzes.map((quiz) => (
                                                        <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-4">
                                                                <div>
                                                                    <div className="font-medium text-gray-900 text-sm sm:text-base">{quiz.title}</div>
                                                                    <div className="text-xs sm:text-sm text-gray-500 line-clamp-1">{quiz.description}</div>
                                                                    <div className="sm:hidden text-xs text-gray-600 mt-1">
                                                                        {quiz.category} • {quiz.questions.length} questions
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 text-gray-600 text-sm sm:text-base hidden sm:table-cell">{quiz.category}</td>
                                                            <td className="py-4">
                                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                                                    quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {quiz.difficulty}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-gray-600 text-sm sm:text-base hidden md:table-cell">
                                                                <div className="flex items-center space-x-1">
                                                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span>{quiz.duration} min</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 text-gray-600 text-sm sm:text-base hidden lg:table-cell">{quiz.questions.length}</td>
                                                            <td className="py-4">
                                                                <div className="flex space-x-1 sm:space-x-2">
                                                                    <button
                                                                        onClick={() => openEditQuizForm(quiz)}
                                                                        className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        title="Edit Quiz"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteQuiz(quiz.id)}
                                                                        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Delete Quiz"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Analytics">
                                                                        <Eye className="w-4 h-4" />
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
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Quiz Analytics</h3>
                                <p className="text-gray-600 text-sm sm:text-base mb-6">
                                    Detailed analytics and student performance reports will be available here soon.
                                    Track completion rates, average scores, and student progress across all your quizzes.
                                </p>
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Quiz Form Modal */}
            {showQuizForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                                </h2>
                                <button
                                    onClick={() => setShowQuizForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form className="p-4 sm:p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); saveQuiz(); }}>
                            {/* Basic Quiz Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quiz Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={quizForm.title}
                                        onChange={handleQuizFormChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        placeholder="Enter quiz title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={quizForm.category}
                                        onChange={handleQuizFormChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        placeholder="e.g., Programming, Mathematics"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={quizForm.duration}
                                        onChange={handleQuizFormChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty Level *
                                    </label>
                                    <select
                                        name="difficulty"
                                        value={quizForm.difficulty}
                                        onChange={handleQuizFormChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={quizForm.description}
                                    onChange={handleQuizFormChange}
                                    rows="3"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="Describe what this quiz covers..."
                                    required
                                ></textarea>
                            </div>

                            {/* Questions */}
                            <div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Question</span>
                                    </button>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    {quizForm.questions.map((question, questionIndex) => (
                                        <div key={questionIndex} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                                <h4 className="text-md font-semibold text-gray-900">
                                                    Question {questionIndex + 1}
                                                </h4>
                                                {quizForm.questions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(questionIndex)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mb-3 sm:mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Question Text *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                    placeholder="Enter your question"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2 sm:space-y-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Options *
                                                </label>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center space-x-2 sm:space-x-3">
                                                        <input
                                                            type="radio"
                                                            name={`correct-answer-${questionIndex}`}
                                                            checked={question.correctAnswer === optionIndex}
                                                            onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                                                            className="text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                                            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                            placeholder={`Option ${optionIndex + 1}`}
                                                            required
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-500 font-mono w-6 sm:w-8 text-center">
                                                            {String.fromCharCode(65 + optionIndex)}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="text-xs sm:text-sm text-gray-500 mt-2">
                                                    * Select the radio button next to the correct answer
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowQuizForm(false)}
                                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                                >
                                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{editingQuiz ? 'Update Quiz' : 'Create Quiz'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPanel;