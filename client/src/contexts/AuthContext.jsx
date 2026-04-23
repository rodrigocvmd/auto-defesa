import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    verifyBeforeUpdateEmail,
    sendEmailVerification,
    updateProfile,
    deleteUser,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { api } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const unsubscribeFirestoreRef = useRef(null);
    const dataLoadedRef = useRef(false);

    async function signup(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Atualizar nome do perfil
        if (name) {
            await updateProfile(user, { displayName: name });
        }

        // Enviar email de verificação com redirecionamento
        await sendVerificationEmail(user);

        return user;
    }

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function deleteUserAccount() {
        if (!currentUser) return;

        // 1. Parar de escutar mudanças para evitar recriação automática (Zombie User)
        if (unsubscribeFirestoreRef.current) {
            unsubscribeFirestoreRef.current();
            unsubscribeFirestoreRef.current = null;
        }

        // 2. Deletar documento do Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        await deleteDoc(userRef);

        // 3. Deletar usuário do Authentication
        await deleteUser(currentUser);
    }

    async function sendVerificationEmail(user) {
        // Configurações para redirecionamento após o clique no email
        // Mantemos handleCodeInApp: false para web padrão. 
        // Para redirecionamento automático, configure a "Action URL" no Firebase Console.
        const actionCodeSettings = {
            url: `${window.location.origin}/email-confirmation`,
            handleCodeInApp: false,
        };
        await sendEmailVerification(user, actionCodeSettings);
    }

    async function resendVerificationEmail() {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            await sendVerificationEmail(auth.currentUser);
        } else {
            throw new Error("Usuário não identificado.");
        }
    }
    async function checkEmailExists(email) {
        try {
            // Usamos a função de backend que tem privilégios de Admin
            // para evitar as limitações da proteção contra enumeração do Firebase
            const result = await api.checkEmail(email);
            return result; // Retorna { exists: true/false, providers: [] }
        } catch (error) {
            console.error("Erro ao verificar email via API:", error);
            return null;
        }
    }

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function logout() {
        if (unsubscribeFirestoreRef.current) {
            unsubscribeFirestoreRef.current();
            unsubscribeFirestoreRef.current = null;
        }
        return signOut(auth);
    }

    function resetPassword(email) {
        const actionCodeSettings = {
            url: `${window.location.origin}/reset-password`,
            handleCodeInApp: false,
        };
        return sendPasswordResetEmail(auth, email, actionCodeSettings);
    }
    async function updateUserEmail(newEmail) {
        // Redireciona para nossa página customizada de confirmação
        const actionCodeSettings = {
            url: `${window.location.origin}/email-confirmation`,
            handleCodeInApp: false,
        };
        
        console.log("Iniciando atualização de email para:", newEmail);
        try {
             await verifyBeforeUpdateEmail(currentUser, newEmail, actionCodeSettings);
             console.log("Email de verificação enviado com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar email de atualização:", error);
            throw error;
        }
    }

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            dataLoadedRef.current = false; // Resetar flag de dados carregados

            // Limpar listener anterior se existir
            if (unsubscribeFirestoreRef.current) {
                unsubscribeFirestoreRef.current();
                unsubscribeFirestoreRef.current = null;
            }

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                
                // Sincronizar dados do Auth com Firestore (Email, Verified, Nome, Foto)
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const updates = {};
                        
                        // 1. Sincronizar Email (Correção do problema de atualização de email)
                        if (user.email && data.email !== user.email) {
                            updates.email = user.email;
                        }

                        // 2. Sincronizar Status de Verificação
                        if (user.emailVerified !== data.emailVerified) {
                            updates.emailVerified = user.emailVerified;
                        }

                        // 3. Sincronizar Nome (Correção do conflito Google OAuth)
                        // Priorizamos o nome do Auth se o do banco estiver vazio ou diferente, 
                        // assumindo que o login social ou update recente é a verdade.
                        if (user.displayName && data.displayName !== user.displayName) {
                             updates.displayName = user.displayName;
                        }
                        
                        // 4. Sincronizar Foto (Opcional, mas bom para OAuth)
                        if (user.photoURL && data.photoURL !== user.photoURL) {
                            updates.photoURL = user.photoURL;
                        }

                        if (Object.keys(updates).length > 0) {
                            console.log("Sincronizando dados do usuário com Firestore:", updates);
                            await updateDoc(userRef, updates);
                        }
                    }
                } catch (e) {
                    console.error("Erro ao sincronizar dados do usuário:", e);
                }

                // Subscribe to real-time updates
                unsubscribeFirestoreRef.current = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Busca créditos de convidado para somar ao total exibido
                        // Usamos Math.max para garantir que não vamos sobrescrever com 0 
                        // caso a API falhe ou demore a sincronizar.
                        try {
                            const guestData = await api.getGuestCredits(user.email);
                            const finalCredits = Math.max(data.credits || 0, guestData.credits);
                            setUserData({ ...data, credits: finalCredits });
                        } catch (e) {
                            console.error("Erro ao sincronizar créditos adicionais:", e);
                            setUserData(data);
                        }
                        
                        dataLoadedRef.current = true; // Marcar como carregado
                    } else {
                        // Se os dados já foram carregados antes e agora sumiram, 
                        // significa que foram deletados (manualmente ou por outra lógica).
                        // Não recriar.
                        if (dataLoadedRef.current) {
                            console.log("Usuário deletado do banco. Fazendo logout...");
                            logout();
                            return;
                        }

                        // Create user doc if it doesn't exist AND it's the first load
                        const providerId = user.providerData[0]?.providerId;
                        const method = providerId === 'google.com' ? 'google' : 'email';

                        const defaultData = {
                            email: user.email,
                            emailVerified: user.emailVerified, // Estado inicial
                            credits: 0,
                            createdAt: new Date(),
                            registrationMethod: method
                        };
                        await setDoc(userRef, defaultData);
                        setUserData(defaultData);
                        dataLoadedRef.current = true;
                    }
                });
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestoreRef.current) {
                unsubscribeFirestoreRef.current();
            }
        };
    }, []);

    const value = {
        currentUser,
        userData,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserEmail,
        resendVerificationEmail,
        deleteUserAccount,
        checkEmailExists
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
