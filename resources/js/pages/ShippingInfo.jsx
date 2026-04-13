// resources/js/Pages/ShippingInfo.jsx
import React from 'react';
import PolicyLayout from '../Layout/PolicyLayout';

export default function ShippingInfo() {
    const shippingZones = [
        { zone: "Inside Dhaka", time: "1-2 business days", cost: "৳60", icon: "fas fa-city" },
        { zone: "Outside Dhaka", time: "2-4 business days", cost: "৳120", icon: "fas fa-map-marker-alt" },
        { zone: "Remote Areas", time: "4-7 business days", cost: "৳150-200", icon: "fas fa-mountain" },
        { zone: "International", time: "7-14 business days", cost: "Varies by location", icon: "fas fa-globe" }
    ];

    return (
        <PolicyLayout title="Shipping Info">
            <div className="shipping-info">
                <div className="mb-4">
                    <p className="text-muted">
                        We provide reliable shipping services across Bangladesh and internationally. 
                        Our partnership with leading courier services ensures safe and timely delivery.
                    </p>
                </div>

                {/* Shipping Zones */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-4" style={{ color: '#112066' }}>
                        <i className="fas fa-map-marked-alt me-2"></i>
                        Shipping Zones & Rates
                    </h4>
                    <div className="row g-4">
                        {shippingZones.map((zone, index) => (
                            <div key={index} className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', transition: 'transform 0.3s' }}>
                                    <div className="card-body p-4">
                                        <i className={`${zone.icon} mb-3`} style={{ fontSize: '35px', color: '#112066' }}></i>
                                        <h5 className="fw-bold mb-2">{zone.zone}</h5>
                                        <div className="mt-3">
                                            <p className="mb-2">
                                                <i className="fas fa-clock me-2 text-muted"></i>
                                                <strong>Delivery Time:</strong> {zone.time}
                                            </p>
                                            <p className="mb-0">
                                                <i className="fas fa-money-bill-wave me-2 text-muted"></i>
                                                <strong>Shipping Cost:</strong> {zone.cost}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Free Shipping Offer */}
                <div className="mb-5 p-4" style={{ background: 'linear-gradient(135deg, #112066 0%, #1a3399 100%)', borderRadius: '15px', color: 'white' }}>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <i className="fas fa-gift fs-1 mb-3"></i>
                            <h4 className="fw-bold">Free Shipping Offer!</h4>
                            <p className="mb-0">Get free shipping on all orders above ৳5000 inside Bangladesh.</p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            <span className="display-6 fw-bold">৳5000+</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Process */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-4" style={{ color: '#112066' }}>
                        <i className="fas fa-step-forward me-2"></i>
                        Shipping Process
                    </h4>
                    <div className="row">
                        {[
                            { step: 1, title: "Order Placed", desc: "You receive order confirmation", icon: "fa-check-circle" },
                            { step: 2, title: "Processing", desc: "We prepare your order (1-2 days)", icon: "fa-boxes" },
                            { step: 3, title: "Shipped", desc: "Order dispatched with tracking", icon: "fa-truck" },
                            { step: 4, title: "Delivered", desc: "Order arrives at your door", icon: "fa-home" }
                        ].map((step, index) => (
                            <div key={index} className="col-md-3 col-6 mb-3">
                                <div className="text-center">
                                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: '#112066', borderRadius: '50%', color: 'white' }}>
                                        <i className={`fas ${step.icon} fs-3`}></i>
                                    </div>
                                    <h6 className="fw-bold mb-1">{step.title}</h6>
                                    <small className="text-muted">{step.desc}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="alert" style={{ background: '#f0f2f5', borderLeft: '4px solid #112066', borderRadius: '10px' }}>
                    <i className="fas fa-info-circle me-2" style={{ color: '#112066' }}></i>
                    <strong>Important Notes:</strong>
                    <ul className="mt-2 mb-0 ps-3">
                        <li>Delivery times may vary during holidays or peak seasons</li>
                        <li>You will receive tracking information via SMS and email</li>
                        <li>Please ensure someone is available to receive the delivery</li>
                        <li>For international shipping, customs duties may apply</li>
                    </ul>
                </div>
            </div>
        </PolicyLayout>
    );
}