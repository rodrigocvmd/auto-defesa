import React, { useEffect } from 'react';

export function NavigationBlocker({ when }) {
    // Mantém apenas a proteção nativa do navegador (Fechar Aba / Atualizar)
    // A proteção de navegação interna (SPA) foi removida pois causava instabilidade (Tela Branca)
    // devido a incompatibilidade com a versão do Router (BrowserRouter vs DataRouter).
    
    useEffect(() => {
        if (!when) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            const message = "Ao sair agora da página, a versão atual do Recurso será salva no seu histórico como a versão final para ser baixada.";
            e.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [when]);

    return null;
}
