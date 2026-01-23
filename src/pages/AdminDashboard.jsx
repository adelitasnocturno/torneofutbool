import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarPlus,
    Swords,
    ClipboardEdit,
    Users,
    LogOut,
    ChevronRight,
    Trophy
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [stats, setStats] = useState({
        totalTeams: 0,
        currentMatchDay: 'Cargando...',
        matchesPlayed: 0,
        totalGoals: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await client.get('/stats/dashboard');
                // Maps backend DTO: { totalTeams, currentMatchDay, matchesPlayed, totalGoals }
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setStats(prev => ({ ...prev, currentMatchDay: 'Sin datos' }));
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const actions = [
        {
            title: 'Crear Jornada',
            icon: CalendarPlus,
            desc: 'Programar una nueva fecha del torneo',
            color: 'from-blue-600 to-blue-500',
            path: '/admin/crear-jornada'
        },
        {
            title: 'Agregar Partido',
            icon: Swords,
            desc: 'Añadir encuentros a una jornada existente',
            color: 'from-indigo-600 to-indigo-500',
            path: '/admin/partidos'
        },
        {
            title: 'Capturar Resultado',
            icon: Trophy,
            desc: 'Registrar marcadores finales y goleadores',
            color: 'from-emerald-600 to-emerald-500',
            path: '/admin/partidos'
        },
        {
            title: 'Gestionar Equipos',
            icon: Users,
            desc: 'Administrar plantillas, jugadores y escudos',
            color: 'from-purple-600 to-purple-500',
            path: '/admin/equipos'
        }
    ];

    return (
        <div className="min-h-screen w-full p-4 pb-20 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 bg-[#0f172a]/80 backdrop-blur-xl p-3 pr-8 rounded-full border border-white/10 shadow-lg">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white leading-none">Panel de Control</h1>
                        <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Administrador</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[#0f172a]/90 hover:bg-red-900/90 backdrop-blur-md text-red-400 hover:text-red-200 font-bold py-2.5 px-6 rounded-xl border border-red-500/30 shadow-lg transition-all active:scale-95 hover:shadow-red-900/20"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Cerrar Sesión</span>
                </button>
            </div>

            {/* Dashboard Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Stats / Overview Card (Optional but looks good) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-[#1e3a8a]/40 to-[#0f172a]/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-xl mb-2">
                    <div className="flex items-center gap-3 mb-4">
                        <LayoutDashboard className="text-blue-400" />
                        <h2 className="text-lg font-bold text-white">Resumen del Torneo</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase font-bold">Equipos</span>
                            <div className="text-lg md:text-2xl font-black text-white mt-1 truncate">{stats.totalTeams}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase font-bold">Jornada Actual</span>
                            <div className="text-lg md:text-2xl font-black text-yellow-400 mt-1 truncate" title={stats.currentMatchDay}>
                                {stats.currentMatchDay}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase font-bold">Partidos</span>
                            <div className="text-lg md:text-2xl font-black text-white mt-1 truncate">{stats.matchesPlayed}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase font-bold">Goles</span>
                            <div className="text-lg md:text-2xl font-black text-white mt-1 truncate">{stats.totalGoals}</div>
                        </div>
                    </div>
                </div>

                {/* Action Cards */}
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => action.path && navigate(action.path)}
                        className="group relative flex flex-col items-start text-left bg-[#0f172a]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                            {action.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-snug mb-4">
                            {action.desc}
                        </p>

                        <div className="mt-auto flex items-center text-xs font-bold text-blue-400 group-hover:text-blue-300 uppercase tracking-wider">
                            Acceder <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}

            </div>
        </div>
    );
};

export default AdminDashboard;
