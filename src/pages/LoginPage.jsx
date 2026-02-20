// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, register, loading, error, clearError } = useAuth();

    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState('');

    // Redirect if already logged in
    const from = location.state?.from || '/';
    useEffect(() => {
        if (user) navigate(from, { replace: true });
    }, [user]);

    useEffect(() => {
        clearError();
        setLocalError('');
        setSuccess('');
    }, [tab]);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setLocalError('');
        clearError();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!form.email || !form.password) {
            setLocalError('Email dan password wajib diisi.');
            return;
        }

        const ok = await login({ email: form.email, password: form.password });
        if (ok) navigate(from, { replace: true });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!form.username || !form.email || !form.password) {
            setLocalError('Semua field wajib diisi.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setLocalError('Password tidak cocok.');
            return;
        }

        const ok = await register({ username: form.username, email: form.email, password: form.password });
        if (ok) {
            setSuccess('Akun berhasil dibuat! Kamu sudah login.');
            setTimeout(() => navigate(from, { replace: true }), 1000);
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl" />
            </div>

            {/* Back button */}
            <div className="relative z-10 p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </button>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-10">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight mb-1">
                        <span className="text-white">Anime</span>
                        <span className="text-primary-400">Play</span>
                    </h1>
                    <p className="text-xs text-gray-600">Nonton anime & donghua favorit kamu</p>
                </div>

                {/* Card */}
                <div className="w-full max-w-sm">
                    {/* Tabs */}
                    <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-white/5">
                        <button
                            onClick={() => setTab('login')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                tab === 'login'
                                    ? 'bg-dark-surface text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-400'
                            }`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => setTab('register')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                tab === 'register'
                                    ? 'bg-dark-surface text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-400'
                            }`}
                        >
                            Daftar
                        </button>
                    </div>

                    {/* Error */}
                    {displayError && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 mb-4 animate-fade-in">
                            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                            <p className="text-xs text-red-400">{displayError}</p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2.5 mb-4 animate-fade-in">
                            <p className="text-xs text-green-400">{success}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-3 animate-fade-in">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="kamu@email.com"
                                        autoComplete="email"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-400 text-black font-semibold text-sm py-2.5 rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                {loading ? 'Memproses...' : 'Masuk'}
                            </button>

                            <p className="text-center text-xs text-gray-600 pt-1">
                                Belum punya akun?{' '}
                                <button
                                    type="button"
                                    onClick={() => setTab('register')}
                                    className="text-primary-400 hover:text-primary-300 font-medium"
                                >
                                    Daftar sekarang
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Register Form */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-3 animate-fade-in">
                            {/* Username */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Username</label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="username"
                                        type="text"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="username kamu"
                                        autoComplete="username"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="kamu@email.com"
                                        autoComplete="email"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="min. 6 karakter"
                                        autoComplete="new-password"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPass ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="ulangi password"
                                        autoComplete="new-password"
                                        className="w-full bg-dark-card border border-white/8 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary-400/50 focus:bg-dark-surface transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-400 text-black font-semibold text-sm py-2.5 rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                {loading ? 'Memproses...' : 'Buat Akun'}
                            </button>

                            <p className="text-center text-xs text-gray-600 pt-1">
                                Sudah punya akun?{' '}
                                <button
                                    type="button"
                                    onClick={() => setTab('login')}
                                    className="text-primary-400 hover:text-primary-300 font-medium"
                                >
                                    Masuk
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
      
