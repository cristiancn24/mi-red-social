import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@mui/material';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthContext } from '../AppContext/AppContext';

const RegistrationForm = () => {
    const { registerWithEmailAndPassword } = useContext(AuthContext);

    const initialValues = {
        name: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required!').matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
        lastName: Yup.string().required('Required!').matches(/^[A-Za-z]+$/, 'Only letters are allowed'),
        username: Yup.string().required('Required!'),
        email: Yup.string().email('Invalid email format').required('Required!'),
        password: Yup.string().required('Required!')
            .min(6, 'Password must be at least 6 characters')
            .matches(/(?=.*[0-9])/, 'Password must contain a number'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await registerWithEmailAndPassword(values.name, values.lastName, values.username, values.email, values.password);
                alert('Registration successful!');
            } catch (error) {
                alert('Error during registration: ' + error.message);
                console.error('Registration Error:', error);
            }
            setSubmitting(false);
        },
    });

    return (
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
                    placeholder='Last Name'
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
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
