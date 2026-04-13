// resources/js/Pages/Auth/Register.jsx

import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/auth.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            }
        });
    };

    return (
        <MainLayout>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <h2 className="auth-title">Create Account</h2>
                            <p className="auth-subtitle">Join us for a better shopping experience</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group mb-4">
                                <label className="form-label fw-semibold">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fas fa-user text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Enter your full name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <div className="text-danger small mt-1">{errors.name}</div>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label fw-semibold">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fas fa-envelope text-muted"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Enter your email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <div className="text-danger small mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label fw-semibold">Phone Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fas fa-phone text-muted"></i>
                                    </span>
                                    <input
                                        type="tel"
                                        className={`form-control border-start-0 ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="Enter your phone number"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.phone && (
                                    <div className="text-danger small mt-1">{errors.phone}</div>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label fw-semibold">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fas fa-lock text-muted"></i>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Create a password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary border-start-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="text-danger small mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label fw-semibold">Confirm Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="fas fa-lock text-muted"></i>
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`form-control border-start-0 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary border-start-0"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <div className="text-danger small mt-1">{errors.password_confirmation}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus me-2"></i>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>Already have an account?</span>
                        </div>

                        <div className="auth-footer">
                            <p className="text-muted mb-0">
                                <Link href="/login" className="auth-link">
                                    Log in to your account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}