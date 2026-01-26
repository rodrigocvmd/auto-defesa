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
    deleteUser
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configurar idioma para português (Emails de reset, verificação, etc)
    auth.languageCode = 'pt';

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
        if (currentUser) {
            await sendVerificationEmail(currentUser);
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
        return verifyBeforeUpdateEmail(currentUser, newEmail);
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
                        setUserData(docSnap.data());
                    } else {
                        // Create user doc if it doesn't exist
                        const defaultData = {
                            email: user.email,
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
        deleteUserAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
