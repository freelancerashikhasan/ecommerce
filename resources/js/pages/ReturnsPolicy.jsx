// resources/js/Pages/ReturnsPolicy.jsx
import React from 'react';
import PolicyLayout from '../Layout/PolicyLayout';

export default function ReturnsPolicy() {
    return (
        <PolicyLayout title="Returns Policy">
            <div className="returns-policy">
                <div className="mb-4">
                    <div className="alert alert-success" style={{ background: '#d4edda', borderColor: '#28a745', borderRadius: '10px' }}>
                        <i className="fas fa-check-circle me-2"></i>
                        <strong>7-Day Easy Returns</strong> - We want you to be completely satisfied with your purchase!
                    </div>
                </div>

                {/* Return Policy Overview */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3" style={{ color: '#112066' }}>
                        <i className="fas fa-undo-alt me-2"></i>
                        Return Policy Overview
                    </h4>
                    <p>At China-Bangladesh Import/Export, customer satisfaction is our top priority. If you're not completely satisfied with your purchase, we're here to help.</p>
                    
                    <div className="row mt-4">
                        <div className="col-md-6 mb-3">
                            <div className="p-3 h-100" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                                <i className="fas fa-check-circle text-success mb-2 fs-4"></i>
                                <h6 className="fw-bold">Eligible for Return</h6>
                                <ul className="small mb-0 ps-3">
                                    <li>Defective or damaged products</li>
                                    <li>Wrong item shipped</li>
                                    <li>Missing parts or accessories</li>
                                    <li>Product not as described</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="p-3 h-100" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                                <i className="fas fa-times-circle text-danger mb-2 fs-4"></i>
                                <h6 className="fw-bold">Not Eligible for Return</h6>
                                <ul className="small mb-0 ps-3">
                                    <li>Used or worn products</li>
                                    <li>Products without original packaging</li>
                                    <li>Custom or personalized orders</li>
                                    <li>Items damaged by customer</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return Process */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-4" style={{ color: '#112066' }}>
                        <i className="fas fa-process me-2"></i>
                        Return Process
                    </h4>
                    <div className="timeline">
                        {[
                            { step: 1, title: "Contact Us", desc: "Email or call within 7 days of delivery", action: "support@example.com / +8801XXXXXXXXX" },
                            { step: 2, title: "Provide Details", desc: "Share order number, product photos, and issue description", action: "Clear photos of the issue" },
                            { step: 3, title: "Get Approval", desc: "We'll review and approve your return request", action: "Within 24-48 hours" },
                            { step: 4, title: "Ship Back", desc: "Send the item back to our address", action: "We'll provide return label" },
                            { step: 5, title: "Refund/Replace", desc: "Get refund or replacement within 5-7 days", action: "Money back or new product" }
                        ].map((item, index) => (
                            <div key={index} className="d-flex mb-4">
                                <div className="flex-shrink-0">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: '#112066', color: 'white' }}>
                                        {item.step}
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h6 className="fw-bold mb-1">{item.title}</h6>
                                    <p className="mb-1 text-muted small">{item.desc}</p>
                                    <small className="text-primary">{item.action}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Information */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3" style={{ color: '#112066' }}>
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Refund Information
                    </h4>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead style={{ background: '#112066', color: 'white' }}>
                                <tr>
                                    <th>Situation</th>
                                    <th>Refund Type</th>
                                    <th>Processing Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Defective product</td><td>Full refund + return shipping</td><td>3-5 business days</td></tr>
                                <tr><td>Wrong item sent</td><td>Full refund + return shipping</td><td>3-5 business days</td></tr>
                                <tr><td>Change of mind</td><td>Partial refund (shipping deducted)</td><td>5-7 business days</td></tr>
                                <tr><td>Product not as described</td><td>Full refund</td><td>3-5 business days</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Contact for Returns */}
                <div className="p-4 text-center" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                    <i className="fas fa-envelope mb-3" style={{ fontSize: '40px', color: '#112066' }}></i>
                    <h5 className="fw-bold">Need to Return an Item?</h5>
                    <p className="text-muted">Contact our returns department for assistance</p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <a href="mailto:returns@example.com" className="btn" style={{ background: '#112066', color: 'white', borderRadius: '25px' }}>
                            <i className="fas fa-envelope me-2"></i>
                            returns@example.com
                        </a>
                        <a href="tel:+8801XXXXXXXXX" className="btn btn-outline-secondary" style={{ borderRadius: '25px' }}>
                            <i className="fas fa-phone me-2"></i>
                            Call Support
                        </a>
                    </div>
                </div>
            </div>
        </PolicyLayout>
    );
}