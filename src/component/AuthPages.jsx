import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, User, Mail, Lock, ArrowRight, GraduationCap, Users, CheckCircle2 } from 'lucide-react';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    // Initialize users in localStorage if not exists
    const initializeUsers = () => {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            if (!formData.name.trim()) {
                newErrors.name = 'Name is required';
            } else if (formData.name.trim().length < 2) {
                newErrors.name = 'Name must be at least 2 characters';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        initializeUsers();

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if user already exists
            const existingUser = users.find(user => user.email === formData.email);
            if (existingUser) {
                setErrors({ email: 'User with this email already exists' });
                setIsLoading(false);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message
            setShowSuccess(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'student'
            });

            // After 2 seconds, switch to login and hide success message
            setTimeout(() => {
                setShowSuccess(false);
                setIsLogin(true);
            }, 2000);

        } catch (error) {
            setErrors({ submit: 'Signup failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        initializeUsers();

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Find user by email
            const user = users.find(u => u.email === formData.email);

            if (!user) {
                setErrors({ email: 'No account found with this email' });
                setIsLoading(false);
                return;
            }

            // Check password
            if (user.password !== formData.password) {
                setErrors({ password: 'Invalid password' });
                setIsLoading(false);
                return;
            }

            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect based on role
            redirectUser(user.role);

        } catch (error) {
            setErrors({ submit: 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const redirectUser = (role) => {
        if (role === 'student') {
            navigate('/dashboard');
        } else if (role === 'teacher') {
            navigate('/teacher-panel'); // This should match your route
        }
    };

    const handleSubmit = (e) => {
        if (isLogin) {
            handleLogin(e);
        } else {
            handleSignup(e);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'student'
        });
        setShowSuccess(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h3>
                        <p className="text-gray-600 mb-6">
                            Your account has been successfully created. Please login to continue.
                        </p>
                        <div className="w-12 h-1 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Auth Card */}
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">ExamPro</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin
                            ? 'Sign in to your account to continue'
                            : 'Join thousands of educators and students'
                        }
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/90">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field - Only for Signup */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Role Selection - Only for Signup */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    I am a
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                                    {formData.role === 'student' ? (
                                        <>
                                            <GraduationCap className="w-4 h-4 text-blue-500" />
                                            <span>Access to quizzes and learning materials</span>
                                        </>
                                    ) : (
                                        <>
                                            <Users className="w-4 h-4 text-green-500" />
                                            <span>Create and manage quizzes, view analytics</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password - Only for Login */}
                        {isLogin && (
                            <div className="text-right">
                                <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors">
                                    Forgot your password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {errors.submit}
                            </div>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.837c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13V9H5V5h4zm0 6v4H5v-4h4zm6 0v4h-4v-4h4zm0-6v4h-4V5h4z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Switch Auth Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                type="button"
                                onClick={switchMode}
                                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 text-sm">
                        © 2024 ExamPro. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPages;