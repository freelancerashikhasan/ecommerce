// resources/js/Pages/Dashboard/Reviews.jsx

import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function Reviews({ reviews }) {
    const [editingReview, setEditingReview] = useState(null);
    const { data, setData, put, delete: destroy, processing } = useForm({
        rating: 5,
        comment: '',
    });

    const handleEdit = (review) => {
        setEditingReview(review.id);
        setData({
            rating: review.rating,
            comment: review.comment || '',
        });
    };

    const handleUpdate = (id) => {
        put(`/dashboard/reviews/${id}`, {
            onSuccess: () => {
                setEditingReview(null);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this review?')) {
            destroy(`/dashboard/reviews/${id}`);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}></i>
        ));
    };

    return (
        <DashboardLayout>
            <div className="reviews-page">
                <h3 className="mb-4">My Reviews</h3>
                
                {reviews.data && reviews.data.length > 0 ? (
                    <>
                        <div className="reviews-list">
                            {reviews.data.map(review => (
                                <div key={review.id} className="review-card mb-4 p-4 border rounded">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <Link href={`/product/${review.product?.slug}`} className="text-decoration-none">
                                                <h5 className="mb-1">{review.product?.name}</h5>
                                            </Link>
                                            <div className="rating mb-2">
                                                {editingReview === review.id ? (
                                                    <select 
                                                        value={data.rating} 
                                                        onChange={e => setData('rating', parseInt(e.target.value))}
                                                        className="form-select form-select-sm w-auto"
                                                    >
                                                        <option value="5">5 Stars</option>
                                                        <option value="4">4 Stars</option>
                                                        <option value="3">3 Stars</option>
                                                        <option value="2">2 Stars</option>
                                                        <option value="1">1 Star</option>
                                                    </select>
                                                ) : (
                                                    renderStars(review.rating)
                                                )}
                                            </div>
                                            <small className="text-muted">
                                                Posted on {new Date(review.created_at).toLocaleDateString()}
                                                {review.is_verified && (
                                                    <span className="badge bg-success ms-2">Verified Purchase</span>
                                                )}
                                            </small>
                                        </div>
                                        <div>
                                            {editingReview !== review.id && (
                                                <>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleEdit(review)}
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(review.id)}
                                                        disabled={processing}
                                                    >
                                                        <i className="fas fa-trash"></i> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {editingReview === review.id ? (
                                        <div>
                                            <textarea
                                                value={data.comment}
                                                onChange={e => setData('comment', e.target.value)}
                                                className="form-control mb-3"
                                                rows="4"
                                                placeholder="Write your review..."
                                            />
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => handleUpdate(review.id)}
                                                    disabled={processing}
                                                >
                                                    Save Changes
                                                </button>
                                                <button 
                                                    className="btn btn-secondary"
                                                    onClick={() => setEditingReview(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mb-0">{review.comment || 'No comment provided.'}</p>
                                    )}
                                    
                                    {review.images && review.images.length > 0 && (
                                        <div className="review-images mt-3 d-flex gap-2">
                                            {review.images.map((image, idx) => (
                                                <img 
                                                    key={idx}
                                                    src={`/storage/reviews/${image}`}
                                                    alt={`Review ${idx + 1}`}
                                                    className="review-image"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {reviews.links && (
                            <div className="d-flex justify-content-center mt-4">
                                {reviews.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-star fa-3x text-muted mb-3"></i>
                        <p>You haven't written any reviews yet</p>
                        <Link href="/" className="btn btn-primary">
                            Write a Review
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                .review-card {
                    background: white;
                    transition: all 0.3s ease;
                }
                
                .review-card:hover {
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .rating i {
                    font-size: 14px;
                    margin-right: 2px;
                }
                
                .review-image {
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .review-image:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </DashboardLayout>
    );
}