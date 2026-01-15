import React from 'react';
import { useLocation } from 'react-router-dom';
import backgroundBg from '../assets/background.jpg';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen relative overflow-x-hidden font-sans text-white">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src={backgroundBg}
                    alt="Background"
                    className="w-full h-screen object-cover object-[center_top]"
                />
                {/* Optional overlay to ensure text readability if needed, kept minimal for now as requested "tal cual" */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>

            {/* Floating Elements - Hide on Admin Routes */}
            {!isAdminRoute && <WhatsAppButton />}
        </div>
    );
};

export default Layout;
