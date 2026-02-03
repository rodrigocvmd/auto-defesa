import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import MainLayout from '../layouts/MainLayout';
import { KeyRound, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const oobCode = searchParams.get('oobCode');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (!oobCode) {
            setError('Código de redefinição inválido ou ausente.');
            setVerifying(false);
            return;
        }

        // Verificar se o código é válido e obter o email associado
        verifyPasswordResetCode(auth, oobCode)
            .then((email) => {
                setEmail(email);
                setVerifying(false);
            })
            .catch((error) => {
                console.error(error);
                setError('O link de redefinição é inválido ou expirou. Tente solicitar um novo.');
                setVerifying(false);
            });
    }, [oobCode]);

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        if (password.length < 6) {
            return setError('A senha deve ter pelo menos 6 caracteres.');
        }

        try {
            setError('');
            setLoading(true);
            await confirmPasswordReset(auth, oobCode, password);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Erro ao redefinir a senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    if (verifying) {
        return (
            <MainLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Verificando link...</h2>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (success) {
        return (
            <MainLayout>
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 text-green-600">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Senha Alterada!</h2>
                        <p className="text-gray-600 mb-8">
                            Sua senha foi redefinida com sucesso. Você já pode acessar sua conta com a nova senha.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Ir para o Login
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 text-blue-600">
                            <KeyRound size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Nova Senha</h2>
                        <p className="text-gray-500 mt-2">
                            Defina uma nova senha para a conta <strong>{email}</strong>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Repita a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
