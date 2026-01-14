import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Direct navigation for prototype
        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Overlay (Specific for Login isolation if needed, or relies on App layout bg) */}
            {/* We rely on the main Layout background usually, but if this is standalone, we might want to ensure it has the bg. 
                 Since it's inside Layout in App.jsx, it inherits the stadium bg. Perfect.
             */}

            {/* Login Card */}
            <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">

                {/* Decorative Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header / Logo */}
                <div className="flex flex-col items-center gap-4 mb-8 text-center relative z-10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500">
                        <img src={logo} alt="Adelitas Logo" className="w-20 h-20 object-contain drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Panel Administrativo</h2>
                        <p className="text-blue-200/60 text-sm font-medium">Torneo Adelitas Nocturno</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">

                    {/* Username Input */}
                    <div className="group">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5 ml-1">Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                className="w-full bg-[#1e293b]/50 border border-white/10 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600 font-medium"
                                placeholder="Ingresa tu usuario"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group">
                        <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5 ml-1">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className="w-full bg-[#1e293b]/50 border border-white/10 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/40 border border-blue-400/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 group"
                    >
                        Ingresar al Panel
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </button>
                </form>

            </div>

            <div className="absolute bottom-4 text-white/20 text-[10px] uppercase font-bold tracking-widest">
                Acceso Restringido
            </div>
        </div>
    );
};

export default AdminLogin;
