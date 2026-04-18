import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuestBanner() {
    const { currentUser } = useAuth();
    const [credits, setCredits] = useState(0);
    const guestEmail = localStorage.getItem("guestEmail");

    useEffect(() => {
        const normalizedEmail = (guestEmail || "").trim().toLowerCase();
        if (!currentUser && normalizedEmail) {
            api.getGuestCredits(normalizedEmail).then(setCredits).catch(() => setCredits(0));
        }
    }, [currentUser, guestEmail]);

    if (currentUser || !guestEmail || credits <= 0) return null;

    return (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-green-800 text-center sm:text-left flex-1">
                    <Zap size={18} className="shrink-0 text-green-600" />
                    <span>
                        Você tem <strong>{credits} {credits === 1 ? 'crédito disponível' : 'créditos disponíveis'}</strong> vinculado ao email <strong>{guestEmail}</strong>.
                    </span>
                </div>
                <div className="flex justify-center gap-3 shrink-0">
                    <Link to="/upload" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg font-bold transition-colors shadow-sm text-center">
                        Gerar Recurso Agora
                    </Link>
                    <Link to="/register" className="bg-green-100 hover:bg-green-200 text-green-900 px-4 py-1.5 rounded-lg font-bold transition-colors border border-green-300 text-center">
                        Salvar em uma Conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
