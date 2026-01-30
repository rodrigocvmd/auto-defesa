import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

        // 1. Deletar documento do Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        await deleteDoc(userRef);

        // 2. Deletar usuário do Authentication
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
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
            // Em projetos novos com proteção contra enumeração, isso pode falhar ou retornar array vazio.
            // Se falhar, assumimos falso ou tratamos o erro.
            console.error("Erro ao verificar email:", error);
            return false;
        }
    }

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function updateUserEmail(newEmail) {
        const actionCodeSettings = {
            url: `${window.location.origin}/profile?emailUpdated=true`,
            handleCodeInApp: false,
        };
        return verifyBeforeUpdateEmail(currentUser, newEmail, actionCodeSettings);
    }

    useEffect(() => {
        let unsubscribeFirestore = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                
                // Subscribe to real-time updates
                unsubscribeFirestore = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);

                        // Sincronizar status do email se mudou
                        if (user.emailVerified !== data.emailVerified) {
                             await updateDoc(userRef, { emailVerified: user.emailVerified });
                        }
                    } else {
                        // Create user doc if it doesn't exist
                        const defaultData = {
                            email: user.email,
                            emailVerified: user.emailVerified, // Estado inicial
                            credits: 0,
                            createdAt: new Date()
                        };
                        await setDoc(userRef, defaultData);
                        setUserData(defaultData);
                    }
                });
            } else {
                setUserData(null);
                if (unsubscribeFirestore) {
                    unsubscribeFirestore();
                }
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
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
