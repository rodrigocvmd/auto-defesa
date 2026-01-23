import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { AlertCircle, LogIn, KeyRound, ArrowLeft } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    
    const { login, loginWithGoogle, resetPassword } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setMessage('');
            setLoading(true);
            
            if (isResetMode) {
                await resetPassword(email);
                setMessage('Verifique seu email para instruções de redefinição de senha.');
            } else {
                await login(email, password);
                navigate(redirect);
            }
        } catch (err) {
            console.error(err);
            if (isResetMode) {
                setError('Falha ao redefinir a senha. Verifique se o email está correto.');
            } else {
                setError('Falha ao fazer login. Verifique suas credenciais.');
            }
        }

        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate(redirect);
        } catch (err) {
            console.error(err);
            setError('Falha ao fazer login com Google.');
        }
        setLoading(false);
    }

    function toggleMode() {
        setIsResetMode(!isResetMode);
        setError('');
        setMessage('');
    }

    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 text-blue-600">
                            {isResetMode ? <KeyRound size={24} /> : <LogIn size={24} />}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isResetMode ? 'Redefinir Senha' : 'Bem-vindo de volta'}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {isResetMode 
                                ? 'Informe seu email para recuperar o acesso' 
                                : 'Acesse sua conta para continuar'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        {!isResetMode && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-right mt-1">
                                    <button 
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading 
                                ? 'Carregando...' 
                                : (isResetMode ? 'Enviar email de recuperação' : 'Entrar')
                            }
                        </button>
                    </form>

                    {isResetMode ? (
                        <div className="mt-6 text-center">
                            <button 
                                onClick={toggleMode}
                                className="text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                                <ArrowLeft size={16} /> Voltar para o Login
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="mt-6 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>

                            <div className="mt-8 text-center text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-medium text-blue-600 hover:text-blue-500">
                                    Cadastre-se
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}