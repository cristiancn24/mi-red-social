import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, db, onAuthStateChanged } from '../Firebase/firebase';
import { query, where, collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AppContext = ({ children }) => {
    const collectionUsersRef = collection(db, 'users');
    const provider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Changed to null for consistency
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const popup = await signInWithPopup(auth, provider);
            const user = popup.user;
            const q = query(collectionUsersRef, where('uid', '==', user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                await addDoc(collectionUsersRef, {
                    uid: user?.uid,
                    name: user?.displayName,
                    email: user?.email,
                    image: user?.photoURL,
                    authProvider: popup?.providerId,
                });
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    const loginWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            alert(err.message);
            console.log(err.message);
            throw err;
        }
    };

    const registerWithEmailAndPassword = async (name, username, lastName, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            await addDoc(collectionUsersRef, {
                uid: user.uid,
                name,
                username,
                lastName,
                providerId: 'email/password',
                email: user.email
            });
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    const sendPasswordToUser = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
            setUser(null);
            setUserData(null);
            navigate('/login');
        } catch (err) {
            alert(err.message);
            console.log('Error signing out:', err.message);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collectionUsersRef, where('uid', '==', user.uid));
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    setUserData(snapshot.docs[0]?.data());
                });
                setUser(user);
                return () => unsubscribeSnapshot(); // Cleanup snapshot listener
            } else {
                setUser(null);
                setUserData(null);
                navigate('/login');
            }
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const initialState = {
        signInWithGoogle,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        sendPasswordToUser,
        signOutUser,
        user,
        userData,
    };


    return (
        <AuthContext.Provider value={initialState}>
            {children}
        </AuthContext.Provider>
    );
};

export default AppContext;
