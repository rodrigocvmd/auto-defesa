import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { AlertCircle, UserPlus, Check, X, Mail, ShieldCheck } from 'lucide-react';

export default function Register() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    
    // Check if the user was redirected from a protected route
    const fromPath = location.state?.from?.pathname || '/profile';
    const redirect = searchParams.get('redirect') || fromPath;
    
    const intent = searchParams.get('intent');
    const emailParam = searchParams.get('email') || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState(emailParam);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Password strength states
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (password) {
            setHasMinLength(password.length >= 6);
            setHasUpperCase(/[A-Z]/.test(password));
            setHasNumber(/[0-9]/.test(password));
            setPasswordsMatch(password === confirmPassword && password !== '');
        } else {
            setHasMinLength(false);
            setHasUpperCase(false);
            setHasNumber(false);
            setPasswordsMatch(false);
        }
    }, [password, confirmPassword]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber) {
            return setError('Por favor, atenda a todos os requisitos de senha.');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, name);
            navigate(redirect);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError(
                    <span>
                        Este email já possui cadastro. <Link to={`/login?redirect=${redirect}`} className="underline font-bold">Faça login aqui</Link>.
                    </span>
                );
            } else {
                setError('Falha ao criar conta. Tente novamente.');
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
            setError('Falha ao cadastrar com Google.');
        }
        setLoading(false);
    }

    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mx-3 my-3">
                    
                    {intent === 'upload' && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm">
                            <div className="flex justify-center mb-2">
                                <ShieldCheck size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-blue-900 font-bold mb-1 text-sm md:text-base">Ambiente Seguro (LGPD)</h3>
                            <p className="text-blue-800 text-xs leading-relaxed">
                                Para garantir o sigilo absoluto do seu documento, crie uma conta gratuita em 10 segundos antes de enviar sua infração.
                            </p>
                        </div>
                    )}

                    <div className="text-center mb-8">
                        {intent !== 'upload' && (
                            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 text-blue-600">
                                <UserPlus size={24} />
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">Crie sua conta</h2>
                        <p className="text-gray-600 mt-2">Comece a defender seus direitos hoje</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Crie uma senha forte"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Password Feedback */}
                            {password && (
                                <div className="mt-3 space-y-1">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Sua senha deve ter:</p>
                                    <div className={`flex items-center gap-2 text-xs ${hasMinLength ? 'text-green-600' : 'text-gray-600'}`}>
                                        {hasMinLength ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        Mínimo de 6 caracteres
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                                        {hasUpperCase ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        Pelo menos 1 letra maiúscula
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                                        {hasNumber ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                                        Pelo menos 1 número
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                                        confirmPassword && !passwordsMatch 
                                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                                        : confirmPassword && passwordsMatch
                                        ? 'border-green-300 focus:ring-green-200 focus:border-green-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold">
                                        {passwordsMatch ? (
                                            <span className="text-green-600 flex items-center gap-1"><Check size={14} /> Iguais</span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1"><X size={14} /> Diferentes</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-600">Ou cadastre-se com</span>
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
                    </div>

                    <div className="mt-8 text-center text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="font-medium text-blue-600 hover:text-blue-500">
                            Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
