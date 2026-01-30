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
        const actionCodeSettings = {
            url: `${window.location.origin}/profile?verified=true`,
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
            return result.exists;
        } catch (error) {
            console.error("Erro ao verificar email via API:", error);
            return false;
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
        return sendPasswordResetEmail(auth, email);
    }

    async function updateUserEmail(newEmail) {
        // Simplificamos a URL para reduzir chances de bloqueio ou erro de encoding
        const actionCodeSettings = {
            url: `${window.location.origin}/profile`,
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
                
                // Sincronizar status do email UMA VEZ ao carregar/logar
                // Isso evita o loop frenético dentro do onSnapshot
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (user.emailVerified !== data.emailVerified) {
                             await updateDoc(userRef, { emailVerified: user.emailVerified });
                        }
                    }
                } catch (e) {
                    console.error("Erro ao sincronizar emailVerified:", e);
                }

                // Subscribe to real-time updates
                unsubscribeFirestoreRef.current = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
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
                        const defaultData = {
                            email: user.email,
                            emailVerified: user.emailVerified, // Estado inicial
                            credits: 0,
                            createdAt: new Date()
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
