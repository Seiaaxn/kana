import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_KEY = 'animeplay_auth';
const USERS_KEY = 'animeplay_users';

const getStoredUsers = () => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
};

const getStoredSession = () => {
    try {
        const data = localStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredSession);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    const register = async ({ username, email, password }) => {
        setLoading(true);
        setError(null);
        await new Promise(r => setTimeout(r, 600));
        const users = getStoredUsers();
        if (users.find(u => u.email === email)) { setError('Email sudah terdaftar.'); setLoading(false); return false; }
        if (users.find(u => u.username === username)) { setError('Username sudah digunakan.'); setLoading(false); return false; }
        if (password.length < 6) { setError('Password minimal 6 karakter.'); setLoading(false); return false; }
        const newUser = { id: Date.now().toString(), username, email, avatar: null, joinedAt: new Date().toISOString() };
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, { ...newUser, password }]));
        const session = { ...newUser };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setUser(session);
        setLoading(false);
        return true;
    };

    const login = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        await new Promise(r => setTimeout(r, 600));
        const users = getStoredUsers();
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) { setError('Email atau password salah.'); setLoading(false); return false; }
        const session = { id: found.id, username: found.username, email: found.email, avatar: found.avatar, joinedAt: found.joinedAt };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setUser(session);
        setLoading(false);
        return true;
    };

    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
    };

    const updateProfile = (updates) => {
        const updated = { ...user, ...updates };
        localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
        const users = getStoredUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx >= 0) { users[idx] = { ...users[idx], ...updates }; localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, clearError, register, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
