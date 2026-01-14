import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Jornadas', path: '/jornadas' },
        { name: 'Posiciones', path: '/posiciones' },
        { name: 'Goleo', path: '/goleo' },
        { name: 'Equipos', path: '/equipos' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full shadow-2xl">
            {/* Top Bar: Metallic Blue Gradient */}
            <div className="bg-[linear-gradient(180deg,#2d4a7c_0%,#1a2c4e_100%)] border-b border-white/10 px-4 py-3 flex items-center justify-between relative z-20">
                {/* Gloss Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

                {/* Logo Section */}
                <div className="flex items-center gap-3 relative z-50 self-start">
                    <div className="relative w-16 flex items-center justify-center">
                        <div className="absolute -top-3 md:-top-3 left-0 w-24 h-24 md:w-36 md:h-36 transition-transform hover:scale-105 origin-top-left">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full animate-pulse"></div>
                            <img
                                src={logo}
                                alt="Torneo Adelitas Nocturno"
                                className="relative z-10 w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Center (Desktop): Jornada Selector */}
                <div className="hidden md:flex flex-1 max-w-xs mx-4 relative z-10">
                    <div className="relative group w-full">
                        <button className="w-full bg-gradient-to-b from-gray-100 to-gray-300 hover:to-gray-200 border border-white/40 rounded shadow-md py-1.5 px-4 flex items-center justify-between text-[#1a2c4e] text-sm transition-all duration-300">
                            <span className="flex items-center gap-2 font-semibold">
                                <span className="w-4 h-4 rounded-sm bg-[#1a2c4e]/10 flex items-center justify-center text-[10px] grayscale">📅</span>
                                Jornada actual: <span className="font-black text-[#1a2c4e]">#5</span>
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#1a2c4e]/70" />
                        </button>
                    </div>
                </div>

                {/* Right Actions & Hamburger */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="hidden md:flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-white/20 transition-colors text-white shadow-sm">
                            <Search className="w-5 h-5 drop-shadow-sm" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/20 transition-colors text-white relative shadow-sm">
                            <Bell className="w-5 h-5 drop-shadow-sm" />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#1f355e] shadow-sm"></span>
                        </button>
                    </div>

                    {/* Hamburger Button (Mobile Only) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Sub-Navbar: Desktop Menu */}
            <div className="hidden md:block bg-[linear-gradient(180deg,#2d4c7e_0%,#1f355e_100%)] border-b border-light-blue-500/30 shadow-lg relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 flex justify-end relative z-10">
                    <ul className="flex items-center gap-8 overflow-x-auto no-scrollbar py-0">
                        {navItems.map((item) => (
                            <li key={item.name} className="shrink-0 relative">
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`py-3 px-2 text-sm font-bold tracking-wide transition-all duration-300 ${isActive(item.path)
                                        ? 'text-white'
                                        : 'text-blue-200 hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </button>
                                {isActive(item.path) && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile Menu Modal Overlay */}
            <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                {/* Side Drawer */}
                <div
                    className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-gradient-to-b from-[#1a2c4e] to-[#0f192e] shadow-2xl border-l border-white/10 transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <span className="text-xl font-black text-white px-2 border-l-4 border-yellow-400">MENU</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {navItems.map((item, idx) => (
                                <li key={item.name} style={{ transitionDelay: `${idx * 50}ms` }} className={`transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                                    <button
                                        onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                        className={`w-full text-left py-4 px-4 rounded-xl font-bold text-lg flex justify-between items-center transition-all ${isActive(item.path)
                                            ? 'bg-gradient-to-r from-blue-600/50 to-transparent text-white border-l-4 border-cyan-400 shadow-lg'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                        {isActive(item.path) && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]"></div>}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-8 border-t border-white/10">
                            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 rounded-lg shadow-lg mb-4 hover:scale-[1.02] transition-transform">
                                Ver Jornada Actual
                            </button>
                            <div className="flex justify-center gap-6 text-white/50">
                                <Search size={24} className="hover:text-white cursor-pointer transition-colors" />
                                <Bell size={24} className="hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
