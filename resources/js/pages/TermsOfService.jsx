// resources/js/Pages/TermsOfService.jsx
import React from 'react';
import PolicyLayout from '../Layout/PolicyLayout';

export default function TermsOfService() {
    const terms = [
        {
            title: "Acceptance of Terms",
            content: "By accessing and using our website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."
        },
        {
            title: "Products and Services",
            content: "We specialize in importing products from China to Bangladesh. Product availability, prices, and descriptions are subject to change without notice."
        },
        {
            title: "Orders and Payments",
            content: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payments must be made in full before order processing."
        },
        {
            title: "Pricing and Taxes",
            content: "Prices are in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise. International customers may be subject to customs duties."
        },
        {
            title: "Shipping and Delivery",
            content: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier services, customs, or natural events."
        },
        {
            title: "Returns and Refunds",
            content: "Returns are accepted within 7 days for eligible products as per our Returns Policy. Refunds are processed according to our refund procedures."
        },
        {
            title: "User Account",
            content: "You are responsible for maintaining the confidentiality of your account. Notify us immediately of any unauthorized use of your account."
        },
        {
            title: "Intellectual Property",
            content: "All content on this site is our property and protected by copyright laws. You may not reproduce or distribute without permission."
        },
        {
            title: "Limitation of Liability",
            content: "We are not liable for indirect damages arising from product use or service interruptions. Our liability is limited to the order value."
        },
        {
            title: "Governing Law",
            content: "These terms are governed by the laws of Bangladesh. Any disputes shall be resolved in Dhaka courts."
        }
    ];

    return (
        <PolicyLayout title="Terms of Service">
            <div className="terms-of-service">
                <div className="mb-4">
                    <div className="alert alert-warning" style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '10px' }}>
                        <i className="fas fa-gavel me-2"></i>
                        <strong>Legal Agreement:</strong> Please read these terms carefully before using our services.
                    </div>
                </div>

                {terms.map((term, index) => (
                    <div key={index} className="mb-4 pb-3" style={{ borderBottom: index < terms.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                        <h5 className="fw-bold mb-2" style={{ color: '#112066' }}>
                            <span className="me-2" style={{ background: '#112066', color: 'white', width: '25px', height: '25px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '14px' }}>
                                {index + 1}
                            </span>
                            {term.title}
                        </h5>
                        <p className="text-muted ms-4 ps-2">{term.content}</p>
                    </div>
                ))}

                {/* Modification of Terms */}
                <div className="mt-5 p-4" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                    <h6 className="fw-bold mb-2">
                        <i className="fas fa-edit me-2" style={{ color: '#112066' }}></i>
                        Modifications to Terms
                    </h6>
                    <p className="small mb-0">
                        We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. 
                        Your continued use of our services constitutes acceptance of modified terms.
                    </p>
                </div>

                {/* Contact Information */}
                <div className="mt-4 text-center">
                    <p className="small text-muted">
                        For questions about these Terms of Service, please contact us at:<br />
                        <strong>legal@example.com</strong> | <strong>+8801XXXXXXXXX</strong>
                    </p>
                </div>
            </div>
        </PolicyLayout>
    );
}