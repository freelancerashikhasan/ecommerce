// resources/js/Pages/Dashboard/Profile.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function Profile({ user, addresses, defaultAddress }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null,
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        formData.append('_method', 'PUT');
        
        post('/dashboard/profile', {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <DashboardLayout>
            <div className="profile-page">
                <h3 className="mb-4">My Profile</h3>
                
                <div className="row">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="mb-3">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Email Address *</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Profile Picture</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.avatar ? 'is-invalid' : ''}`}
                                    onChange={e => setData('avatar', e.target.files[0])}
                                    accept="image/*"
                                />
                                {errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn defaultColor"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            
                            {recentlySuccessful && (
                                <div className="alert alert-success mt-3">Profile updated successfully!</div>
                            )}
                        </form>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Default Address</h5>
                            </div>
                            <div className="card-body">
                                {defaultAddress ? (
                                    <>
                                        <p><strong>{defaultAddress.name}</strong></p>
                                        <p>{defaultAddress.phone}</p>
                                        <p>{defaultAddress.address}</p>
                                        <p>{defaultAddress.city}, {defaultAddress.postal_code}</p>
                                        <p>{defaultAddress.country}</p>
                                        <Link href="/dashboard/addresses" className="btn btn-sm defaultColor">
                                            Manage Addresses
                                        </Link>
                                    </>
                                ) : (
                                    <p className="text-muted">No default address set</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}