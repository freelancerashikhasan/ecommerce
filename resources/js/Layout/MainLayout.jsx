// resources/js/layouts/MainLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="d-flex flex-grow-1">
                <main className="flex-grow-1">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}