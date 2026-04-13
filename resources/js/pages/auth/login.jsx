// resources/js/Pages/Auth/Login.jsx

import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/auth.css';

export default function Login({ status, canResetPassword }) {
    const [loginMethod, setLoginMethod] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otpError, setOtpError] = useState('');

    const passwordForm = useForm({
        email: '',
        password: '',
        remember: false
    });

    const phoneForm = useForm({
        phone: '',
        otp: '',
        remember: false
    });

    const handlePasswordLogin = (e) => {
        e.preventDefault();
        passwordForm.post('/login', {
            onSuccess: () => {
                passwordForm.reset('password');
            },
            onError: (errors) => {
                console.log('Login errors:', errors);
            }
        });
    };

    const handlePhoneLogin = (e) => {
        e.preventDefault();
        
        if (!otpSent) {
            phoneForm.post('/send-otp', {
                preserveState: true,
                onSuccess: (response) => {
                    setOtpSent(true);
                    startCountdown(60);
                    setOtpError('');
                    
                    if (response.props?.debug_otp) {
                        alert(`Debug OTP: ${response.props.debug_otp}`);
                    }
                },
                onError: (errors) => {
                    console.log('OTP send errors:', errors);
                    setOtpError(errors?.phone?.[0] || 'Failed to send OTP');
                }
            });
        } else {
            phoneForm.post('/verify-otp', {
                preserveState: true,
                onSuccess: (response) => {
                    if (response.props?.redirect) {
                        window.location.href = response.props.redirect;
                    }
                },
                onError: (errors) => {
                    console.log('OTP verification errors:', errors);
                    setOtpError(errors?.otp?.[0] || 'Invalid OTP code');
                }
            });
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/auth/google/redirect';
    };

    const startCountdown = (seconds) => {
        setCountdown(seconds);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resendOtp = () => {
        if (countdown === 0) {
            phoneForm.post('/send-otp', {
                preserveState: true,
                onSuccess: (response) => {
                    startCountdown(60);
                    setOtpError('');
                    if (response.props?.debug_otp) {
                        alert(`Debug OTP: ${response.props.debug_otp}`);
                    }
                },
                onError: (errors) => {
                    setOtpError(errors?.phone?.[0] || 'Failed to resend OTP');
                }
            });
        }
    };

    return (
        <MainLayout>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        {/* Header */}
                        <div className="auth-header">
                            <div className="auth-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <h2 className="auth-title">Welcome Back</h2>
                            <p className="auth-subtitle">Choose your preferred login method</p>
                        </div>

                        {/* Login Method Tabs */}
                        <div className="login-methods-tabs">
                            <button
                                className={`method-tab ${loginMethod === 'password' ? 'active' : ''}`}
                                onClick={() => {
                                    setLoginMethod('password');
                                    setOtpSent(false);
                                    setOtpError('');
                                }}
                            >
                                <i className="fas fa-envelope me-2"></i>
                                Email
                            </button>
                            <button
                                className={`method-tab ${loginMethod === 'phone' ? 'active' : ''}`}
                                onClick={() => {
                                    setLoginMethod('phone');
                                    setOtpSent(false);
                                    setOtpError('');
                                }}
                            >
                                <i className="fas fa-phone me-2"></i>
                                Phone
                            </button>
                            <button
                                className={`method-tab ${loginMethod === 'google' ? 'active' : ''}`}
                                onClick={() => {
                                    setLoginMethod('google');
                                    setOtpSent(false);
                                }}
                            >
                                <i className="fab fa-google me-2"></i>
                                Google
                            </button>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="alert alert-success mb-4">
                                <i className="fas fa-check-circle me-2"></i>
                                {status}
                            </div>
                        )}

                        {/* Error Message */}
                        {otpError && (
                            <div className="alert alert-danger mb-4">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {otpError}
                            </div>
                        )}

                        {/* Password Login Form */}
                        {loginMethod === 'password' && (
                            <form onSubmit={handlePasswordLogin} className="auth-form">
                                <div className="form-group mb-4">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="fas fa-envelope text-muted"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control border-start-0 ${passwordForm.errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Enter your email"
                                            value={passwordForm.data.email}
                                            onChange={e => passwordForm.setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {passwordForm.errors.email && (
                                        <div className="text-danger small mt-1">{passwordForm.errors.email}</div>
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
                                            className={`form-control border-start-0 ${passwordForm.errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                            value={passwordForm.data.password}
                                            onChange={e => passwordForm.setData('password', e.target.value)}
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
                                    {passwordForm.errors.password && (
                                        <div className="text-danger small mt-1">{passwordForm.errors.password}</div>
                                    )}
                                </div>

                                <div className="auth-options">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={passwordForm.data.remember}
                                            onChange={(e) => passwordForm.setData('remember', e.target.checked)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">Remember me</span>
                                    </label>

                                    {canResetPassword && (
                                        <Link href="/forgot-password" className="forgot-link">
                                            Forgot Password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="auth-button"
                                    disabled={passwordForm.processing}
                                >
                                    {passwordForm.processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Log In with Email
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Phone/OTP Login Form */}
                        {loginMethod === 'phone' && (
                            <form onSubmit={handlePhoneLogin} className="auth-form">
                                <div className="form-group mb-4">
                                    <label className="form-label fw-semibold">Phone Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="fas fa-phone text-muted"></i>
                                        </span>
                                        <input
                                            type="tel"
                                            className={`form-control border-start-0 ${phoneForm.errors.phone ? 'is-invalid' : ''}`}
                                            placeholder="Enter your phone number"
                                            value={phoneForm.data.phone}
                                            onChange={e => phoneForm.setData('phone', e.target.value)}
                                            disabled={otpSent}
                                            required
                                        />
                                    </div>
                                    {phoneForm.errors.phone && (
                                        <div className="text-danger small mt-1">{phoneForm.errors.phone}</div>
                                    )}
                                </div>

                                {otpSent && (
                                    <>
                                        <div className="form-group mb-4">
                                            <label className="form-label fw-semibold">OTP Code</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0">
                                                    <i className="fas fa-key text-muted"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control border-start-0 ${phoneForm.errors.otp ? 'is-invalid' : ''}`}
                                                    placeholder="Enter 6-digit OTP"
                                                    value={phoneForm.data.otp}
                                                    onChange={e => phoneForm.setData('otp', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {phoneForm.errors.otp && (
                                                <div className="text-danger small mt-1">{phoneForm.errors.otp}</div>
                                            )}
                                        </div>
                                        
                                        <div className="otp-resend">
                                            <button
                                                type="button"
                                                className="resend-btn"
                                                onClick={resendOtp}
                                                disabled={countdown > 0 || phoneForm.processing}
                                            >
                                                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="auth-options">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={phoneForm.data.remember}
                                            onChange={(e) => phoneForm.setData('remember', e.target.checked)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">Remember me</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="auth-button"
                                    disabled={phoneForm.processing}
                                >
                                    {phoneForm.processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            {otpSent ? 'Verifying...' : 'Sending OTP...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className={`fas ${otpSent ? 'fa-check-circle' : 'fa-paper-plane'} me-2`}></i>
                                            {otpSent ? 'Verify & Login' : 'Send OTP'}
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Google Login */}
                        {loginMethod === 'google' && (
                            <div className="google-login-section">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="google-login-btn"
                                >
                                    <i className="fab fa-google me-3"></i>
                                    Continue with Google
                                </button>
                                <p className="google-info mt-3">
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Your Google account information will be used only for authentication
                                </p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="auth-divider">
                            <span>New to our store?</span>
                        </div>

                        {/* Register Link */}
                        <div className="auth-footer">
                            <p className="text-muted mb-0">
                                Don't have an account?{' '}
                                <Link href="/register" className="auth-link">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}