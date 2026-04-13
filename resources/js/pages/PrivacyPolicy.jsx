// resources/js/Pages/PrivacyPolicy.jsx
import React from 'react';
import PolicyLayout from '../Layout/PolicyLayout';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "Information We Collect",
            icon: "fa-database",
            content: [
                "Personal information (name, email, phone number, address)",
                "Payment information (processed securely via payment gateways)",
                "Order history and preferences",
                "Device information and browsing behavior",
                "Communication preferences"
            ]
        },
        {
            title: "How We Use Your Information",
            icon: "fa-chart-line",
            content: [
                "Process and fulfill your orders",
                "Communicate about orders and updates",
                "Improve our products and services",
                "Send promotional offers (with your consent)",
                "Prevent fraud and ensure security"
            ]
        },
        {
            title: "Information Sharing",
            icon: "fa-share-alt",
            content: [
                "We never sell your personal information",
                "Share with delivery partners for order fulfillment",
                "Payment information shared only with payment processors",
                "Required by law enforcement when legally obligated",
                "With your explicit consent"
            ]
        },
        {
            title: "Data Security",
            icon: "fa-shield-virus",
            content: [
                "SSL encryption for all transactions",
                "Regular security audits and updates",
                "Secure data storage practices",
                "Limited employee access to customer data",
                "PCI compliance for payment processing"
            ]
        },
        {
            title: "Your Rights",
            icon: "fa-user-check",
            content: [
                "Access your personal data",
                "Request data correction or deletion",
                "Opt-out of marketing communications",
                "Download your data in portable format",
                "Lodge complaints with authorities"
            ]
        }
    ];

    return (
        <PolicyLayout title="Privacy Policy">
            <div className="privacy-policy">
                <div className="mb-4">
                    <p className="text-muted">
                        Last updated: January 1, 2024
                    </p>
                    <p>
                        At China-Bangladesh Import/Export, we take your privacy seriously. 
                        This policy describes how we collect, use, and protect your personal information.
                    </p>
                </div>

                {sections.map((section, index) => (
                    <div key={index} className="mb-5">
                        <h4 className="fw-bold mb-3" style={{ color: '#112066' }}>
                            <i className={`fas ${section.icon} me-2`}></i>
                            {section.title}
                        </h4>
                        <ul className="list-unstyled">
                            {section.content.map((item, i) => (
                                <li key={i} className="mb-2 d-flex align-items-start">
                                    <i className="fas fa-check-circle mt-1 me-3" style={{ color: '#112066', fontSize: '14px' }}></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Cookies Policy */}
                <div className="mb-5 p-4" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                    <h5 className="fw-bold mb-3">
                        <i className="fas fa-cookie-bite me-2" style={{ color: '#112066' }}></i>
                        Cookies Policy
                    </h5>
                    <p className="small mb-0">
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                        By using our website, you consent to our use of cookies. You can manage cookie preferences in your browser settings.
                    </p>
                </div>

                {/* Contact for Privacy Concerns */}
                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #112066 0%, #1a3399 100%)', borderRadius: '15px', color: 'white' }}>
                    <i className="fas fa-lock mb-3 fs-1"></i>
                    <h5 className="fw-bold">Questions About Privacy?</h5>
                    <p className="mb-3">Contact our Privacy Officer for any privacy-related concerns</p>
                    <a href="mailto:privacy@example.com" className="btn btn-light" style={{ borderRadius: '25px', color: '#112066' }}>
                        <i className="fas fa-envelope me-2"></i>
                        privacy@example.com
                    </a>
                </div>
            </div>
        </PolicyLayout>
    );
}