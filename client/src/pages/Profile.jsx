import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
    CheckCircle,
    Plus
} from 'lucide-react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { jsPDF } from 'jspdf';

export default function Profile() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('defenses');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });

    // Estados do Formulário de Perfil
    const [displayName, setDisplayName] = useState('');
    const [defaultPlate, setDefaultPlate] = useState('');
    
    // Estados do Formulário de Senha
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estado do Histórico
    const [defenses, setDefenses] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        async function fetchUserData() {
            try {
                // 1. Carregar dados básicos do Auth
                setDisplayName(currentUser.displayName || '');

                // 2. Carregar dados estendidos do Firestore (ex: placa padrão)
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    if (data.defaultPlate) setDefaultPlate(data.defaultPlate);
                }

                // 3. Carregar histórico de defesas
                const defensesRef = collection(db, 'defenses');
                const q = query(
                    defensesRef, 
                    where('userId', '==', currentUser.uid)
                );
                
                const querySnapshot = await getDocs(q);
                const defensesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Ordenar no cliente para evitar necessidade de índice composto
                defensesList.sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA; // Decrescente
                });

                setDefenses(defensesList);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setPageLoading(false);
            }
        }

        fetchUserData();
    }, [currentUser, navigate]);

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            // Atualizar Auth Profile
            if (currentUser.displayName !== displayName) {
                await updateProfile(currentUser, {
                    displayName: displayName
                });
            }

            // Atualizar Firestore Profile
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, {
                email: currentUser.email,
                displayName: displayName,
                defaultPlate: defaultPlate,
                updatedAt: new Date()
            }, { merge: true });

            setMessage({ type: 'success', content: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', content: 'Erro ao atualizar perfil. Tente novamente.' });
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

    const downloadPDF = (defense) => {
        if (!defense.defenseText) {
            alert("Texto da defesa não encontrado.");
            return;
        }

        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(defense.defenseText, 160);
        let cursorY = 25;
        splitText.forEach(line => {
            if (cursorY > 270) { doc.addPage(); cursorY = 25; }
            const isTitle = line.length < 50 && line === line.toUpperCase() && line.trim().length > 0;
            if (isTitle) {
                doc.setFont("times", "bold");
                doc.text(line, 105, cursorY, { align: "center" });
                doc.setFont("times", "normal");
            } else {
                doc.text(line, 25, cursorY, { align: "justify", maxWidth: 160 });
            }
            cursorY += 6;
        });
        doc.save(`Defesa_${defense.licensePlate || 'Recurso'}.pdf`);
    };

    if (pageLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
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
                                <Link to="/" className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                                    <Plus size={16} /> Nova Defesa
                                </Link>
                            </div>

                            {defenses.length > 0 ? (
                                <div className="space-y-4">
                                    {defenses.map((defense) => (
                                        <div key={defense.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-100 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                                    <Shield size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{defense.infractionType || 'Infração não especificada'}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1"><Car size={14} /> {defense.licensePlate || 'N/A'}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} /> 
                                                            {defense.createdAt?.seconds 
                                                                ? new Date(defense.createdAt.seconds * 1000).toLocaleDateString() 
                                                                : 'Data desc.'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    defense.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {defense.status === 'completed' ? 'Pronto' : 'Processando'}
                                                </span>
                                                <button 
                                                    onClick={() => downloadPDF(defense)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors" 
                                                    title="Baixar PDF"
                                                >
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="mb-4">Nenhuma defesa gerada ainda.</p>
                                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline">
                                        Criar minha primeira defesa
                                    </Link>
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
