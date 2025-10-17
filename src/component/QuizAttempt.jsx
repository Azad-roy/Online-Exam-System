import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle,
    Flag,
    AlertCircle,
    BookOpen,
    User,
    Home
} from 'lucide-react';

const QuizAttempt = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quiz, setQuiz] = useState(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quizQuestions, setQuizQuestions] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Save quiz result to localStorage
    const saveQuizResult = (result) => {
        try {
            const userResults = JSON.parse(localStorage.getItem('userResults') || '[]');
            const userResult = {
                ...result,
                userId: user.id,
                userName: user.name,
                userEmail: user.email
            };

            userResults.push(userResult);
            localStorage.setItem('userResults', JSON.stringify(userResults));
            console.log('Result saved successfully');

            // Also update user's quiz history
            updateUserQuizHistory(result);
        } catch (error) {
            console.error('Error saving quiz result:', error);
        }
    };

    // Update user's quiz history
    const updateUserQuizHistory = (result) => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                if (!users[userIndex].quizHistory) {
                    users[userIndex].quizHistory = [];
                }

                users[userIndex].quizHistory.push({
                    quizId: result.quizId,
                    quizTitle: result.quizTitle,
                    score: result.score,
                    totalQuestions: result.totalQuestions,
                    percentage: result.percentage,
                    completedAt: result.submittedAt
                });

                localStorage.setItem('users', JSON.stringify(users));
                console.log('User history updated');
            }
        } catch (error) {
            console.error('Error updating user quiz history:', error);
        }
    };

    // Calculate score and save results
    const handleSubmitQuiz = () => {
        console.log('Submit quiz function called');

        if (isQuizSubmitted) {
            console.log('Quiz already submitted');
            return;
        }

        setIsQuizSubmitted(true);
        console.log('Quiz submitted state set to true');

        // Calculate score
        const score = quizQuestions.reduce((total, question) => {
            return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
        }, 0);

        console.log('Score calculated:', score);

        const percentage = Math.round((score / quizQuestions.length) * 100);
        console.log('Percentage calculated:', percentage);

        // Prepare result data
        const result = {
            quizId: quiz.id,
            quizTitle: quiz.title,
            score: score,
            totalQuestions: quizQuestions.length,
            percentage: percentage,
            timeSpent: formatTime(quiz.duration * 60 - timeLeft),
            submittedAt: new Date().toISOString(),
            answers: answers
        };

        console.log('Result data prepared:', result);

        // Save result to localStorage
        saveQuizResult(result);

        // Navigate to results page
        console.log('Attempting navigation to /results');

        const resultState = {
            score: score,
            totalQuestions: quizQuestions.length,
            quizTitle: quiz.title,
            timeSpent: formatTime(quiz.duration * 60 - timeLeft),
            correctAnswers: score,
            incorrectAnswers: quizQuestions.length - score,
            quizId: quiz.id
        };

        console.log('Navigation state:', resultState);

        // Use a small timeout to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/results', { state: resultState });
        }, 100);
    };

    // Load questions from teacher-created quizzes
    const loadQuizQuestions = (quizId) => {
        try {
            const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
            const selectedQuiz = teacherQuizzes.find(q => q.id == quizId); // Use == for string/number comparison

            if (selectedQuiz && selectedQuiz.questions) {
                console.log('Found teacher quiz:', selectedQuiz);
                // Transform teacher questions to match quiz format
                const transformedQuestions = selectedQuiz.questions.map((q, index) => ({
                    id: index + 1,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer
                }));
                setQuizQuestions(transformedQuestions);
                console.log('Transformed questions:', transformedQuestions);
            } else {
                console.log('Teacher quiz not found, using fallback');
                // Fallback to mock questions if not found
                setQuizQuestions(getMockQuestions());
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            setQuizQuestions(getMockQuestions());
            setIsLoading(false);
        }
    };

    // Mock questions fallback
    const getMockQuestions = () => {
        return [
            {
                id: 1,
                question: "What is the output of: console.log(typeof null)?",
                options: ["null", "object", "undefined", "string"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Which method is used to create a new array with all elements that pass the test?",
                options: ["map()", "filter()", "reduce()", "forEach()"],
                correctAnswer: 1
            }
        ];
    };

    // Check authentication and load quiz data
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (!currentUser) {
            navigate('/auth');
            return;
        }

        if (currentUser.role !== 'student') {
            navigate('/dashboard');
            return;
        }

        setUser(currentUser);

        // Get quiz data from navigation state
        const quizData = location.state?.quiz;

        if (!quizData) {
            navigate('/dashboard');
            return;
        }

        setQuiz(quizData);
        setTimeLeft(quizData.duration * 60);

        // Load questions from teacher-created quizzes
        loadQuizQuestions(quizData.id);

        console.log('Quiz data loaded:', quizData);
    }, [navigate, location]);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && quiz && !isQuizSubmitted) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quiz && !isQuizSubmitted) {
            console.log('Time expired, auto-submitting quiz');
            handleSubmitQuiz();
        }
    }, [timeLeft, quiz, isQuizSubmitted]);

    // Handle answer selection
    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    // Navigate to next question
    const nextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    // Navigate to previous question
    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Jump to specific question
    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    // Handle exit quiz
    const handleExitQuiz = () => {
        if (window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            navigate('/dashboard');
        }
    };

    // Calculate progress
    const progress = ((Object.keys(answers).length / quizQuestions.length) * 100).toFixed(0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (isQuizSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Submitted!</h3>
                    <p className="text-gray-600 mb-6">
                        Your answers have been submitted successfully. Redirecting to results...
                    </p>
                    <div className="w-12 h-1 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Quiz Info */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={handleExitQuiz}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span className="hidden sm:inline">Exit Quiz</span>
                            </button>

                            <div className="hidden md:block border-l border-gray-300 h-8"></div>

                            <div className="hidden md:block">
                                <h1 className="text-lg font-semibold text-gray-900">{quiz?.title}</h1>
                                <p className="text-sm text-gray-600">{quiz?.description}</p>
                            </div>
                        </div>

                        {/* Timer and User Info */}
                        <div className="flex items-center space-x-4">
                            {/* Timer */}
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'
                                }`}>
                                <Clock className="w-5 h-5" />
                                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                            </div>

                            {/* User Info */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-sm text-gray-500">Student</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Quiz Content */}
            <div className="max-w-6xl mx-auto p-4">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Flag className="w-5 h-5 mr-2 text-blue-600" />
                                Questions
                            </h3>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                    {Object.keys(answers).length} of {quizQuestions.length} answered
                                </div>
                            </div>

                            {/* Question Numbers */}
                            <div className="grid grid-cols-5 gap-2">
                                {quizQuestions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => jumpToQuestion(index)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all transform hover:scale-110 ${currentQuestionIndex === index
                                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                                : answers[quizQuestions[index].id] !== undefined
                                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitQuiz}
                                className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                Submit Quiz
                            </button>

                            {/* Warning */}
                            {timeLeft < 300 && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-700">
                                        Less than 5 minutes remaining! Please submit your answers soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Question Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            {/* Question Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                    </h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {quiz?.difficulty}
                                        </span>
                                        <span>•</span>
                                        <span>Category: {quiz?.category}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="mb-8">
                                <p className="text-lg text-gray-800 bg-blue-50 p-6 rounded-xl leading-relaxed">
                                    {quizQuestions[currentQuestionIndex]?.question}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-4 mb-8">
                                {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(quizQuestions[currentQuestionIndex].id, index)}
                                        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${answers[quizQuestions[currentQuestionIndex].id] === index
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[quizQuestions[currentQuestionIndex].id] === index
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : 'border-gray-300 text-gray-400'
                                                }`}>
                                                {answers[quizQuestions[currentQuestionIndex].id] === index ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                ) : (
                                                    <Circle className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-lg">{option}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                Option {String.fromCharCode(65 + index)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 transform hover:-translate-x-1"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Previous</span>
                                </button>

                                <div className="text-sm text-gray-500">
                                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                </div>

                                {currentQuestionIndex === quizQuestions.length - 1 ? (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        <span>Submit Quiz</span>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextQuestion}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        <span>Next Question</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;