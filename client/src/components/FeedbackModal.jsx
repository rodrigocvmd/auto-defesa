import React, { useState } from 'react';
import { Star, Send, X, Loader2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const FeedbackModal = ({ onClose }) => {
    const { currentUser } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        setLoading(true);
        try {
            // Salvar feedback na coleção 'feedbacks'
            await addDoc(collection(db, 'feedbacks'), {
                userId: currentUser?.uid || 'anonymous',
                rating,
                comment,
                createdAt: serverTimestamp(),
                source: 'upload_defense'
            });

            // Marcar que o usuário já deu feedback no documento do usuário
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, {
                    hasGivenFeedback: true
                });
            }

            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Erro ao salvar feedback:", error);
            alert("Ocorreu um erro ao enviar seu feedback. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star size={40} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Obrigado!</h3>
                    <p className="text-gray-600">Seu feedback é muito importante para nós.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300">
                <div className="bg-blue-600 p-6 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-xl font-black mb-1">Sua opinião importa!</h3>
                    <p className="text-blue-100 text-sm">Como foi sua experiência gerando este recurso?</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sua Nota</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        size={36}
                                        className={`${
                                            star <= (hover || rating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Comentário (Opcional)</label>
                            <span className="text-xs text-gray-400">{comment.length}/400</span>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value.slice(0, 400))}
                            placeholder="Conte-nos o que achou ou como podemos melhorar..."
                            className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-700 text-sm h-32"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || rating === 0}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                            loading || rating === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Enviar Feedback <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
