// resources/js/Layouts/MainLayout.jsx

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    
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