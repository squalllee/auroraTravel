
import React, { useState } from 'react';

interface AuthPageProps {
    onAuthenticate: (isViewOnly: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticate }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Check password against environment variable
        const correctPassword = import.meta.env.VITE_APP_PASSWORD || '123456';

        if (password === correctPassword) {
            sessionStorage.setItem('auth_mode', 'full');
            onAuthenticate(false);
        } else {
            setError('密碼錯誤，請重試');
            setPassword('');
        }
        setIsLoading(false);
    };

    const handleViewOnlyMode = () => {
        sessionStorage.setItem('auth_mode', 'view_only');
        onAuthenticate(true);
    };

    return (
        <div className="min-h-screen bg-jp-paper flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl font-bold text-jp-red mb-2">
                        北歐極光遊
                    </h1>
                    <p className="text-sm text-stone-500 uppercase tracking-widest">
                        越南 • 丹麥 • 瑞典 • 挪威
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                    {/* Password Section */}
                    <div className="p-8">
                        <h2 className="font-serif text-2xl font-bold text-jp-ink mb-6 text-center">
                            輸入通行密碼
                        </h2>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                                    密碼
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50 focus:border-jp-red transition-all"
                                    placeholder="請輸入密碼"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className="w-full py-3 bg-jp-red text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? '驗證中...' : '進入行程'}
                            </button>
                        </form>
                    </div>

                    {/* Divider */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center px-8">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-stone-500">或</span>
                        </div>
                    </div>

                    {/* View Only Section */}
                    <div className="p-8 pt-0">
                        <button
                            onClick={handleViewOnlyMode}
                            className="w-full py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors border-2 border-stone-300"
                        >
                            以瀏覽模式進入
                        </button>
                        <p className="text-xs text-stone-500 text-center mt-3">
                            瀏覽模式下無法新增或刪除行程
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-xs text-stone-400">
                    <p>🔒 您的行程資料受到保護</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
