// resources/js/Pages/Dashboard/ChangePassword.jsx

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function ChangePassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/change-password', {
            onSuccess: () => {
                reset();
                alert('Password changed successfully!');
            }
        });
    };

    return (
        <DashboardLayout>
            <div className="change-password-page">
                <h3 className="mb-4">Change Password</h3>
                
                <div className="alert alert-info mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    Password must be at least 8 characters long and include letters, numbers, and special characters.
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="mb-4">
                        <label className="form-label">Current Password</label>
                        <div className="input-group">
                            <input
                                type={showCurrent ? "text" : "password"}
                                className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                                value={data.current_password}
                                onChange={e => setData('current_password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                <i className={`fas ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.current_password && <div className="text-danger small mt-1">{errors.current_password}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label">New Password</label>
                        <div className="input-group">
                            <input
                                type={showNew ? "text" : "password"}
                                className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                value={data.new_password}
                                onChange={e => setData('new_password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowNew(!showNew)}
                            >
                                <i className={`fas ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.new_password && <div className="text-danger small mt-1">{errors.new_password}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Confirm New Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirm ? "text" : "password"}
                                className={`form-control ${errors.new_password_confirmation ? 'is-invalid' : ''}`}
                                value={data.new_password_confirmation}
                                onChange={e => setData('new_password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.new_password_confirmation && <div className="text-danger small mt-1">{errors.new_password_confirmation}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn defaultColor px-4"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Changing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-key me-2"></i>
                                Change Password
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .password-form {
                    max-width: 500px;
                }

                .form-label {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .form-control:focus {
                    border-color: #112066;
                    box-shadow: 0 0 0 0.2rem rgba(99, 76, 159, 0.25);
                }

                .alert-info {
                    background: #d1ecf1;
                    border-color: #bee5eb;
                    color: #0c5460;
                    border-radius: 10px;
                }
            `}</style>
        </DashboardLayout>
    );
}