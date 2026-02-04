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
    Trophy,
    ChevronDown
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import client from '../api/client';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { tournamentId, setTournamentId, tournaments } = useTournament(); // Get ID and Selector utils

    // Stats State
    const [stats, setStats] = useState({
        totalTeams: 0,
        currentMatchDay: 'Cargando...',
        matchesPlayed: 0,
        totalGoals: 0
    });

    // Settings State
    const [isDoubleRound, setIsDoubleRound] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!tournamentId) return;
            try {
                // Parallel fetch for speed
                const [statsRes, tournamentRes] = await Promise.all([
                    client.get(`/tournaments/${tournamentId}/dashboard-stats`),
                    client.get(`/tournaments/${tournamentId}`)
                ]);

                setStats(statsRes.data);
                setIsDoubleRound(tournamentRes.data.isDoubleRound || false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setStats(prev => ({ ...prev, currentMatchDay: 'Sin datos' }));
            }
        };
        fetchData();
    }, [tournamentId]);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleConfirmSwitch = async () => {
        try {
            await client.put(`/tournaments/${tournamentId}/settings`, { isDoubleRound: true });
            setIsDoubleRound(true);
            setIsConfirmModalOpen(false);
            // Optional: Trigger full refresh if stats might change (e.g. reactivated teams)
            // window.location.reload(); or re-fetch stats
        } catch (error) {
            console.error("Error updating tournament settings:", error);
            alert("Error al activar la segunda vuelta.");
        }
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
            title: 'Gestionar Permisos',
            icon: ClipboardEdit,
            desc: 'Justificantes y ausencias de equipos',
            color: 'from-pink-600 to-pink-500',
            path: '/admin/permisos'
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
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 bg-[#0f172a]/80 backdrop-blur-xl p-3 pr-8 rounded-full border border-white/10 shadow-lg">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-none">Panel de Control</h1>
                            <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Administrador</span>
                        </div>
                    </div>

                    {/* Tournament Selector */}
                    <div className="relative group">
                        <div className="flex items-center gap-3 bg-[#1e293b]/90 backdrop-blur-xl p-3 px-5 rounded-2xl border border-blue-500/30 shadow-lg text-white transition-all hover:border-blue-400/50">
                            <Trophy size={18} className="text-yellow-400" />
                            <div className="relative">
                                <select
                                    value={tournamentId}
                                    onChange={(e) => setTournamentId(Number(e.target.value))}
                                    className="bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer pr-6 min-w-[180px] text-white focus:ring-0"
                                >
                                    {tournaments.map(t => (
                                        <option key={t.id} value={t.id} className="bg-[#0f172a] text-white py-2">
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                                {tournaments.find(t => t.id === tournamentId)?.season || 'N/A'}
                            </div>
                        </div>
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

                {/* Settings Card */}
                <div className="group relative flex flex-col items-start text-left bg-[#0f172a]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:border-blue-400/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white mb-4 shadow-lg">
                        <Swords size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">Configuración</h3>
                    <p className="text-gray-400 text-sm leading-snug mb-4">
                        Ajustes generales del torneo
                    </p>

                    <div className="mt-auto w-full">
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isDoubleRound ? 'text-emerald-400' : 'text-blue-200'}`}>
                                {isDoubleRound ? 'Activo (Ida y Vuelta)' : 'Solo Ida'}
                            </span>
                            <button
                                disabled={isDoubleRound} // One-Way Lock
                                onClick={() => setIsConfirmModalOpen(true)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDoubleRound ? 'bg-emerald-500 cursor-not-allowed opacity-80' : 'bg-gray-600 hover:bg-gray-500'}`}
                                title={isDoubleRound ? "Modo activado permanentemente" : "Activar segunda vuelta"}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDoubleRound ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)}></div>
                    <div className="relative bg-[#0f172a] border border-emerald-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <Swords className="text-emerald-400" size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">¿Activar Ida y Vuelta?</h2>
                        <div className="text-gray-300 text-sm mb-6 text-left bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                            <p className="font-bold text-white">⚠️ Esta acción es irreversible.</p>
                            <p>• El torneo se extenderá para jugar la revancha.</p>
                            <p>• Todos los equipos <span className="text-yellow-400">eliminados deportivamente</span> serán reactivados automáticamente.</p>
                            <p className="text-xs text-gray-500 mt-2">* Equipos dados de baja administrativa permanecerán baneados.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm">Cancelar</button>
                            <button onClick={handleConfirmSwitch} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95">
                                Sí, Activar y Reactivar Equipos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
