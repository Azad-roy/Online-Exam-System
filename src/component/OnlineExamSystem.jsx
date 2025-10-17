import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    BarChart3,
    Users,
    Shield,
    Menu,
    X,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    ArrowRight,
    CheckCircle,
    Star,
    Award,
    Zap
} from 'lucide-react';

const OnlineExamSystem = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Clock className="w-12 h-12" />,
            title: "Timed Quizzes",
            description: "Simulate real exam conditions with customizable time limits and automatic submission.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <BarChart3 className="w-12 h-12" />,
            title: "Instant Results",
            description: "Get immediate feedback with detailed analytics and performance reports.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Role-Based Access",
            description: "Secure system with different access levels for students, teachers, and administrators.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Admin Dashboard",
            description: "Comprehensive dashboard for managing exams, users, and tracking progress.",
            color: "from-orange-500 to-red-500"
        }
    ];

    const stats = [
        { number: "50K+", label: "Active Students" },
        { number: "10K+", label: "Exams Created" },
        { number: "99.8%", label: "Satisfaction Rate" },
        { number: "24/7", label: "Support Available" }
    ];

    const handleGetStarted = () => {
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
                    : 'bg-transparent py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ExamPro
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['Home', 'Features', 'Testimonials', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
                                >
                                    {item}
                                </a>
                            ))}
                            <button
                                onClick={() => navigate('/auth')}
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white/95 backdrop-blur-md rounded-xl shadow-xl mt-4 py-4 animate-fade-in">
                            <div className="flex flex-col space-y-4 px-4">
                                {['Home', 'Features', 'Testimonials', 'Contact'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item}
                                    </a>
                                ))}
                                <button
                                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-left py-2"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { handleGetStarted(); setIsMenuOpen(false); }}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                    <Zap className="w-4 h-4" />
                                    <span>Trusted by 50,000+ students worldwide</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Test Your Knowledge{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Anytime, Anywhere!
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Revolutionize your learning experience with our comprehensive online exam platform.
                                    Built for educators and students who demand excellence, efficiency, and exceptional results.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleGetStarted}
                                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                    <span>Start Learning Free</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <span>Watch Demo</span>
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                        <div className="text-gray-600 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-3xl p-8 backdrop-blur-sm">
                                {/* Main Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="space-y-6">
                                        {/* Browser Header */}
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>

                                        {/* Quiz Content */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">JavaScript Fundamentals</h3>
                                                <div className="flex items-center space-x-1 text-orange-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="text-sm font-medium">4.8</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="h-3 bg-gray-200 rounded-full w-full">
                                                    <div className="h-3 bg-green-500 rounded-full w-3/4"></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Progress: 75%</span>
                                                    <span>15/20 questions</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                {['Option A', 'Option B', 'Option C', 'Option D'].map((option, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-3 rounded-xl border-2 text-center font-medium transition-all duration-300 ${idx === 0
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                                                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium">Time: 45:00</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-medium">Score: 85%</span>
                                    </div>
                                </div>

                                {/* Background Decorations */}
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <CheckCircle className="w-4 h-4" />
                            <span>Why Choose ExamPro?</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Modern Education
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Powerful features designed to enhance learning experiences and streamline assessment processes
                            for both students and educators.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Learning Experience?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of educators and students who are already achieving better results with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGetStarted}
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            Start Free Trial
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">ExamPro</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Empowering educators and students with cutting-edge online examination tools
                                for a better, more efficient learning experience.
                            </p>
                            <div className="flex space-x-4">
                                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                {['Home', 'Features', 'Pricing', 'About Us'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>support@exampro.com</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Education Street</li>
                                <li>Learning City, LC 12345</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ExamPro Online Exam System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OnlineExamSystem;