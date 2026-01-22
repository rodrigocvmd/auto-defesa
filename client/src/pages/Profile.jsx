import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
    User, 
    FileText, 
    Settings, 
    Shield, 
    Clock, 
    Download, 
    Car,
    Save,
    Lock,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { updateProfile, updatePassword } from 'firebase/auth';

export default function Profile() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('defenses');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    // Estados do Formulário de Perfil
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [defaultPlate, setDefaultPlate] = useState(''); // Futuro: carregar do Firestore
    
    // Estados do Formulário de Senha
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Mock de dados para histórico (será substituído por dados do Firestore)
    const mockDefenses = [
        { id: 1, date: '2025-01-15', licensePlate: 'ABC-1234', infraction: 'Excesso de velocidade', status: 'concluido' },
        { id: 2, date: '2025-01-20', licensePlate: 'XYZ-9876', infraction: 'Estacionamento irregular', status: 'pendente' },
    ];

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            if (currentUser.displayName !== displayName) {
                await updateProfile(currentUser, {
                    displayName: displayName
                });
            }
            // Aqui salvaríamos a placa padrão no Firestore
            setMessage({ type: 'success', content: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', content: 'Erro ao atualizar perfil.' });
        }
        setLoading(false);
    }

    async function handleUpdatePassword(e) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setMessage({ type: 'error', content: 'As senhas não conferem.' });
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            await updatePassword(currentUser, newPassword);
            setMessage({ type: 'success', content: 'Senha alterada com sucesso!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', content: 'Erro ao alterar senha. Pode ser necessário fazer login novamente.' });
        }
        setLoading(false);
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header do Perfil */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-blue-100 p-6 rounded-full text-blue-600">
                        <User size={48} />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentUser?.displayName || 'Usuário'}
                        </h1>
                        <p className="text-gray-500">{currentUser?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Membro desde {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : '-'}
                        </p>
                    </div>
                </div>

                {/* Navegação de Abas */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2 md:pb-0">
                    <button
                        onClick={() => setActiveTab('defenses')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            activeTab === 'defenses' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <FileText size={18} /> Minhas Defesas
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            activeTab === 'profile' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <Settings size={18} /> Dados e Preferências
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            activeTab === 'security' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <Lock size={18} /> Segurança
                    </button>
                </div>

                {/* Conteúdo das Abas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    
                    {/* Feedback Message */}
                    {message.content && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 text-sm ${
                            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                            {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                            {message.content}
                        </div>
                    )}

                    {/* ABA: MINHAS DEFESAS */}
                    {activeTab === 'defenses' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Histórico de Defesas</h2>
                                <button className="text-sm text-blue-600 font-medium hover:underline">
                                    Nova Defesa
                                </button>
                            </div>

                            {mockDefenses.length > 0 ? (
                                <div className="space-y-4">
                                    {mockDefenses.map((defense) => (
                                        <div key={defense.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-100 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                                    <Shield size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{defense.infraction}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1"><Car size={14} /> {defense.licensePlate}</span>
                                                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(defense.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    defense.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {defense.status === 'concluido' ? 'Pronto' : 'Processando'}
                                                </span>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Baixar PDF">
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Nenhuma defesa gerada ainda.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ABA: DADOS E PREFERÊNCIAS */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleUpdateProfile}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Como devemos te chamar?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                                        value={currentUser?.email}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa Padrão (Opcional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={defaultPlate}
                                        onChange={(e) => setDefaultPlate(e.target.value)}
                                        placeholder="ABC-1234"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Usaremos esta placa para preencher automaticamente novos formulários.</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} /> Salvar Alterações
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ABA: SEGURANÇA */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleUpdatePassword}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Alterar Senha</h2>
                            
                            <div className="max-w-md space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repita a senha"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || !newPassword}
                                    className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Lock size={18} /> Atualizar Senha
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}
