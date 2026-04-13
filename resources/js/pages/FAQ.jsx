// resources/js/Pages/FAQ.jsx
import React, { useState } from 'react';
import PolicyLayout from '../Layout/PolicyLayout';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Order & Payment",
            questions: [
                {
                    q: "How can I place an order?",
                    a: "You can place an order directly through our website, or use our Manual Order system for custom requests. Simply add products to cart and proceed to checkout, or click on 'Manual Order' for special requirements."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and bank transfers. For international orders, we accept PayPal and credit cards."
                },
                {
                    q: "Is it safe to order from your website?",
                    a: "Yes, absolutely! We use SSL encryption to protect your data. Your payment information is secure and we never store your sensitive payment details."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "How long does delivery take?",
                    a: "Inside Dhaka: 1-2 business days. Outside Dhaka: 2-4 business days. International shipping: 7-14 business days depending on location."
                },
                {
                    q: "Do you offer free shipping?",
                    a: "Yes, we offer free shipping on orders over ৳5000 inside Bangladesh. For orders below this amount, shipping charges apply based on your location."
                },
                {
                    q: "Can I track my order?",
                    a: "Yes, once your order is shipped, you'll receive a tracking number via SMS and email. You can track your order status in your account dashboard."
                }
            ]
        },
        {
            category: "Products & Returns",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We offer a 7-day return policy for defective or wrong products. Items must be unused and in original packaging. Please check our Returns Policy page for detailed information."
                },
                {
                    q: "Do you import products from China?",
                    a: "Yes, we specialize in importing products from China to Bangladesh. We can help you source any product from Chinese manufacturers with competitive pricing."
                },
                {
                    q: "What if I receive a damaged product?",
                    a: "If you receive a damaged product, please contact us within 24 hours of delivery with photos. We'll arrange for a replacement or refund immediately."
                }
            ]
        },
        {
            category: "Import Services",
            questions: [
                {
                    q: "Can you import custom products for me?",
                    a: "Absolutely! Use our Manual Order system to submit your custom product requirements. We'll source the products from China and handle all import procedures."
                },
                {
                    q: "What is the minimum order quantity for imports?",
                    a: "Minimum order quantity varies by product. Generally, we can handle both small (10-50 units) and bulk orders. Contact us for specific requirements."
                },
                {
                    q: "How long does import processing take?",
                    a: "Import processing typically takes 15-30 days from order confirmation to delivery, depending on product availability and customs clearance."
                }
            ]
        }
    ];

    const toggleFAQ = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <PolicyLayout title="FAQ">
            <div className="faq-section">
                <div className="mb-4">
                    <p className="text-muted fs-5">
                        Find answers to common questions about our products, services, and import/export operations.
                    </p>
                </div>

                {faqs.map((category, catIndex) => (
                    <div key={catIndex} className="mb-5">
                        <h4 className="fw-bold mb-4 pb-2" style={{ color: '#112066', borderBottom: '3px solid #112066', display: 'inline-block' }}>
                            <i className="fas fa-folder-open me-2"></i>
                            {category.category}
                        </h4>
                        
                        <div className="accordion" id={`accordion-${catIndex}`}>
                            {category.questions.map((faq, qIndex) => {
                                const key = `${catIndex}-${qIndex}`;
                                const isOpen = openIndex === key;
                                
                                return (
                                    <div key={qIndex} className="card border-0 mb-3 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <div 
                                            className="card-header bg-white p-0 border-0"
                                            onClick={() => toggleFAQ(catIndex, qIndex)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center p-3">
                                                <h6 className="mb-0 fw-semibold" style={{ color: '#112066' }}>
                                                    <i className="fas fa-question-circle me-2" style={{ color: '#112066' }}></i>
                                                    {faq.q}
                                                </h6>
                                                <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted`}></i>
                                            </div>
                                        </div>
                                        
                                        {isOpen && (
                                            <div className="card-body pt-0 pb-3 px-3">
                                                <p className="text-muted mb-0 ps-4">
                                                    <i className="fas fa-reply-all me-2" style={{ color: '#112066', fontSize: '12px' }}></i>
                                                    {faq.a}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Still Have Questions */}
                <div className="mt-5 p-4 text-center" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                    <i className="fas fa-comments" style={{ fontSize: '40px', color: '#112066' }}></i>
                    <h5 className="fw-bold mt-3">Still Have Questions?</h5>
                    <p className="text-muted mb-3">Can't find the answer you're looking for? Please contact our support team.</p>
                    <button className="btn px-4" style={{ background: '#112066', color: 'white', borderRadius: '25px' }}>
                        <i className="fas fa-headset me-2"></i>
                        Contact Support
                    </button>
                </div>
            </div>

            <style jsx>{`
                .card-header {
                    transition: all 0.3s ease;
                }
                
                .card-header:hover {
                    background: #f8f9fa;
                }
            `}</style>
        </PolicyLayout>
    );
}