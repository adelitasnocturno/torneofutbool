import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Trophy, Users, Activity } from 'lucide-react';

const EquipoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data based on ID
    // En una app real, haríamos un fetch(id) aquí.
    const team = {
        name: 'Las Adelitas',
        logo: null, // Si es null, usa el icono Shield
        stats: { played: 5, won: 4, drawn: 1, lost: 0, gf: 12, ga: 3, pts: 13 },
        players: [
            { id: 1, name: 'Maria González', number: 10, position: 'Delantera', img: null },
            { id: 2, name: 'Carmen López', number: 7, position: 'Medio', img: null },
            { id: 3, name: 'Luisa F.', number: 4, position: 'Defensa', img: null },
            { id: 4, name: 'Ana R.', number: 1, position: 'Portera', img: null },
            { id: 5, name: 'Sofia T.', number: 11, position: 'Delantera', img: null },
            { id: 6, name: 'Elena P.', number: 8, position: 'Medio', img: null },
            { id: 7, name: 'Patricia M.', number: 3, position: 'Defensa', img: null },
        ]
    };

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6">

            {/* Header & Hero Section - Consistent Dark Glass */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit group bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-xs uppercase tracking-wide">Volver</span>
                    </button>

                    {/* Team Identity */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <Shield className="text-blue-400" size={48} />
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl">
                                {team.name}
                            </h2>
                            <span className="text-blue-200/80 font-medium text-lg flex items-center gap-2">
                                <Users size={18} /> Plantel Oficial
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Puntos', value: team.stats.pts, icon: Trophy, color: 'text-yellow-400', border: 'border-yellow-500/30' },
                    { label: 'Jugados', value: team.stats.played, icon: Activity, color: 'text-blue-400', border: 'border-blue-500/30' },
                    { label: 'Goles Favor', value: team.stats.gf, icon: Activity, color: 'text-green-400', border: 'border-green-500/30' },
                    { label: 'Goles Contra', value: team.stats.ga, icon: Activity, color: 'text-red-400', border: 'border-red-500/30' },
                ].map((stat, index) => (
                    <div key={index} className={`bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-lg
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-500/10 to-transparent' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={stat.color} size={16} />
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <span className={`text-3xl font-black ${stat.color} drop-shadow-sm`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Squad List */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="text-blue-300" />
                    Jugadoras
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {team.players.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 bg-[#1e293b]/60 border border-white/5 rounded-lg p-3 hover:bg-[#1e293b] transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/10">
                                {player.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">{player.name}</span>
                                <span className="text-gray-400 text-xs">{player.position}</span>
                            </div>
                            <div className="ml-auto text-xl font-black text-white/10 font-mono">
                                #{player.number}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default EquipoDetail;
