import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import '../Login/Login.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@mui/material';
import { AuthContext } from '../AppContext/AppContext';
import { auth, onAuthStateChanged } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';

const initialValues = {
    email: '',
    password: '',
    name: '',
    lastName: '',
    username: '',
    registerEmail: '',
    registerPassword: ''
};

const validationSchema = Yup.object({
    name: Yup.string().required('Required!').matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
    lastName: Yup.string().required('Required!').matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
    username: Yup.string().required('Required!'),
    registerEmail: Yup.string().email('Invalid email format').required('Required!'),
    registerPassword: Yup.string().required('Required!')
        .min(6, 'Password must be at least 6 characters')
        .matches(/(?=.*[0-9])/, 'Password must contain a number'),
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string().required('Required!')
        .min(6, 'Password must be at least 6 characters')
        .matches(/(?=.*[0-9])/, 'Password must contain a number')
});

const Login = () => {
    const { signInWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            } else {
                console.log('User is not logged in');
            }
        });
    }, [navigate]);

    const [action, setAction] = useState('');

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            if (action === '') {
                handleLogin(values);
            } else {
                handleRegister(values);
            }
            setSubmitting(false);
        }
    });

    const handleLogin = async (values) => {
        const { email, password } = values;
        try {
            await loginWithEmailAndPassword(email, password);
            alert("Login successful!");
        } catch (error) {
            alert("Error during login: " + error.message);
            console.error('Login Error:', error)
        }
    };

    const handleRegister = async (values) => {
        const { name, lastName, username, registerEmail, registerPassword } = values;
        try {
            await registerWithEmailAndPassword(name, lastName, username, registerEmail, registerPassword);
            alert("Registration successful!");
            setAction(''); // Reset action after successful registration
        } catch (error) {
            alert("Error during registration: " + error.message);
            console.error('Registration Error:', error)
        }
    };

    const registerLink = (e) => {
        e.preventDefault();
        setAction(' active');
    };

    const loginLink = (e) => {
        e.preventDefault();
        setAction('');
    };

    return (
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={formik.handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            name='email'
                            type="email"
                            placeholder='Email'
                            {...formik.getFieldProps('email')}
                        />
                        <FaEnvelope className='icon' />
                        {formik.touched.email && formik.errors.email && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.email}
                            </Typography>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            name='password'
                            type="password"
                            placeholder='Password'
                            {...formik.getFieldProps('password')}
                        />
                        <FaLock className='icon' />
                        {formik.touched.password && formik.errors.password && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.password}
                            </Typography>
                        )}
                    </div>
                    <div className="remember-forgot flex pl-48 pt-2">
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit" className='mb-6'>Login</button>
                    <button type="button" onClick={signInWithGoogle}>Sign in with Google</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>
            <div className="form-box register">
                <form onSubmit={formik.handleSubmit}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input
                            name='name'
                            type="text"
                            placeholder='Name'
                            {...formik.getFieldProps('name')}
                        />
                        <FaUser className='icon' />
                        {formik.touched.name && formik.errors.name && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.name}
                            </Typography>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            name='lastName'
                            type="text"
                            placeholder='LastName'
                            {...formik.getFieldProps('lastName')}
                        />
                        <FaUser className='icon' />
                        {formik.touched.lastName && formik.errors.lastName && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.lastName}
                            </Typography>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            name='username'
                            type="text"
                            placeholder='Username'
                            {...formik.getFieldProps('username')}
                        />
                        <FaUser className='icon' />
                        {formik.touched.username && formik.errors.username && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.username}
                            </Typography>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            name='registerEmail'
                            type="email"
                            placeholder='Email'
                            {...formik.getFieldProps('registerEmail')}
                        />
                        <FaEnvelope className='icon' />
                        {formik.touched.registerEmail && formik.errors.registerEmail && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.registerEmail}
                            </Typography>
                        )}
                    </div>
                    <div className="input-box">
                        <input
                            name='registerPassword'
                            type="password"
                            placeholder='Password'
                            {...formik.getFieldProps('registerPassword')}
                        />
                        <FaLock className='icon' />
                        {formik.touched.registerPassword && formik.errors.registerPassword && (
                            <Typography variant='body2' color='error'>
                                {formik.errors.registerPassword}
                            </Typography>
                        )}
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
