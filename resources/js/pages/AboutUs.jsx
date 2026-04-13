// resources/js/Pages/ContactUs.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '../Layout/MainLayout';

export default function ContactUs() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 5000);
            }
        });
    };

    const contactInfo = [
        {
            icon: "fas fa-map-marker-alt",
            title: "Visit Us",
            details: [
                "House #123, Road #45, Gulshan-2",
                "Dhaka-1212, Bangladesh"
            ],
            action: "Get Directions"
        },
        {
            icon: "fas fa-phone-alt",
            title: "Call Us",
            details: [
                "+880 1XXX-XXXXXX",
                "+880 1XXX-XXXXXX"
            ],
            action: "Call Now"
        },
        {
            icon: "fas fa-envelope",
            title: "Email Us",
            details: [
                "info@chinabdimport.com",
                "support@chinabdimport.com"
            ],
            action: "Send Email"
        },
        {
            icon: "fas fa-clock",
            title: "Working Hours",
            details: [
                "Saturday - Thursday: 9AM - 8PM",
                "Friday: Closed"
            ],
            action: "Schedule Meeting"
        }
    ];

    const faqs = [
        {
            q: "How can I place a manual order?",
            a: "Click on 'Manual Order' in the top header or navigate to our Manual Order page. Fill out the form with your product requirements and we'll contact you within 24 hours."
        },
        {
            q: "Do you provide import services for bulk orders?",
            a: "Yes, we specialize in bulk imports from China. Contact our team for custom quotes and shipping solutions."
        },
        {
            q: "What is your response time?",
            a: "We typically respond to all inquiries within 24 hours during business days."
        }
    ];

    return (
        <MainLayout>
            <div className="contact-us">
                {/* Hero Section */}
                <div className="hero-section" style={{ background: 'linear-gradient(135deg, #112066 0%, #1a3399 100%)', color: 'white', padding: '60px 0' }}>
                    <div className="container text-center">
                        <h1 className="display-4 fw-bold mb-3">
                            <i className="fas fa-envelope-open-text me-2"></i>
                            Contact Us
                        </h1>
                        <p className="lead mb-0">
                            We'd love to hear from you! Get in touch for any questions or inquiries.
                        </p>
                    </div>
                </div>

                <div className="container py-5">
                    <div className="row g-4">
                        {/* Contact Form */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="card-header p-4" style={{ background: '#112066', border: 'none' }}>
                                    <h4 className="mb-0 text-white fw-bold">
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Send us a Message
                                    </h4>
                                </div>
                                <div className="card-body p-4 p-md-5">
                                    {submitted && (
                                        <div className="alert alert-success mb-4">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Thank you! We'll get back to you soon.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Your Name <span className="text-danger">*</span>
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="fas fa-user" style={{ color: '#112066' }}></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Email Address <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-envelope" style={{ color: '#112066' }}></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        placeholder="your@email.com"
                                                        required
                                                    />
                                                </div>
                                                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Phone Number
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-phone" style={{ color: '#112066' }}></i>
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        placeholder="01XXXXXXXXX"
                                                    />
                                                </div>
                                                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Subject <span className="text-danger">*</span>
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="fas fa-tag" style={{ color: '#112066' }}></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                    value={data.subject}
                                                    onChange={e => setData('subject', e.target.value)}
                                                    placeholder="What is this regarding?"
                                                    required
                                                />
                                            </div>
                                            {errors.subject && <div className="invalid-feedback d-block">{errors.subject}</div>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">
                                                Message <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                rows="5"
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                placeholder="Tell us how we can help you..."
                                                required
                                            ></textarea>
                                            {errors.message && <div className="invalid-feedback d-block">{errors.message}</div>}
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100 py-2"
                                            style={{ background: '#112066', color: 'white', borderRadius: '10px' }}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="col-lg-6">
                            <div className="row g-4">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100 text-center" style={{ borderRadius: '15px', transition: 'transform 0.3s' }}>
                                            <div className="card-body p-4">
                                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: '#112066', borderRadius: '50%' }}>
                                                    <i className={`${info.icon} text-white fs-3`}></i>
                                                </div>
                                                <h5 className="fw-bold mb-3">{info.title}</h5>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-muted small mb-1">{detail}</p>
                                                ))}
                                                <a href="#" className="btn btn-sm mt-3" style={{ color: '#112066', textDecoration: 'underline' }}>
                                                    {info.action} <i className="fas fa-arrow-right ms-1"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Map Section */}
                            <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                <div className="card-body p-0">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14601.8!2d90.4054!3d23.7858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b5b4c8e8b1%3A0x8b4e5c6d7e8f9a0b!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890!5m2!1sen!2sbd"
                                        width="100%"
                                        height="250"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Office Location"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                                <div className="card-header p-4" style={{ background: '#112066', border: 'none' }}>
                                    <h4 className="mb-0 text-white fw-bold">
                                        <i className="fas fa-question-circle me-2"></i>
                                        Frequently Asked Questions
                                    </h4>
                                </div>
                                <div className="card-body p-4 p-md-5">
                                    <div className="row g-4">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="col-md-4">
                                                <div className="p-3 h-100" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                                                    <i className="fas fa-question-circle mb-2" style={{ color: '#112066', fontSize: '24px' }}></i>
                                                    <h6 className="fw-bold mb-2">{faq.q}</h6>
                                                    <p className="small text-muted mb-0">{faq.a}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Connect */}
                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <h5 className="fw-bold mb-3" style={{ color: '#112066' }}>
                                <i className="fas fa-share-alt me-2"></i>
                                Connect With Us
                            </h5>
                            <div className="d-flex justify-content-center gap-3">
                                <a href="#" className="btn" style={{ background: '#1877f2', color: 'white', borderRadius: '50%', width: '45px', height: '45px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="btn" style={{ background: '#e4405f', color: 'white', borderRadius: '50%', width: '45px', height: '45px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="btn" style={{ background: '#0077b5', color: 'white', borderRadius: '50%', width: '45px', height: '45px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="btn" style={{ background: '#25D366', color: 'white', borderRadius: '50%', width: '45px', height: '45px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .contact-us {
                    font-family: 'Inter', sans-serif;
                }
                
                .card {
                    transition: transform 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                }
                
                .form-control:focus {
                    border-color: #112066;
                    box-shadow: 0 0 0 0.2rem rgba(17, 32, 102, 0.25);
                }
                
                @media (max-width: 768px) {
                    .hero-section {
                        padding: 40px 0 !important;
                    }
                    
                    .display-4 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </MainLayout>
    );
}