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
    updateProfile
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
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

        // Enviar email de verificação
        await sendEmailVerification(user);

        // Deslogar para obrigar login após verificação (opcional, mas seguro)
        await signOut(auth);

        return user;
    }

    async function login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            throw new Error('Email not verified');
        }
        return userCredential;
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
        updateUserEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
