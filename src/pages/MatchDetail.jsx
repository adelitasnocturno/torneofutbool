import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, MapPin, Trophy } from 'lucide-react';

const MatchDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data (Simula ser uno finalizado o uno programado según el ID)
    const isFinal = id === '101' || id === '102'; // IDs de ejemplo para finalizar

    const match = {
        id: id,
        date: 'Martes 10/01/2026',
        time: '19:00',
        court: 'Cancha 1',
        status: isFinal ? 'Finalizado' : 'Programada',
        homeTeam: { name: 'Las Adelitas', id: 1 },
        awayTeam: { name: 'Cobras FC', id: 2 },
        score: isFinal ? { home: 3, away: 1 } : null,
        goals: isFinal ? [
            { id: 1, player: 'Maria G.', team: 'Las Adelitas', minute: 12 },
            { id: 2, player: 'Sofia R.', team: 'Las Adelitas', minute: 45 },
            { id: 3, player: 'Ana P.', team: 'Cobras FC', minute: 67 },
            { id: 4, player: 'Maria G.', team: 'Las Adelitas', minute: 88 },
        ] : []
    };

    return (
        <div className="w-full min-h-screen pb-24">
            {/* Header Section - Consistent with JornadaDetail */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit group bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-xs uppercase tracking-wide">Volver</span>
                    </button>

                </div>

                <div className="relative z-10 mt-4 text-center">
                    <span className="text-blue-200/80 font-medium text-sm flex items-center justify-center gap-2">
                        <Clock size={14} /> {match.date} - {match.time}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center justify-center gap-1 mt-1">
                        <MapPin size={12} /> {match.court}
                    </span>
                </div>
            </div>

            {/* Scoreboard Card - Massive & Glass */}
            <div className="relative w-full bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col items-center gap-6 shadow-2xl mb-6 overflow-hidden">
                {/* Background FX */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/20 to-transparent pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 md:gap-8">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_20px_rgba(30,58,138,0.5)]">
                            <Shield className="text-blue-400 w-10 h-10 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-white font-black text-lg md:text-2xl leading-tight">{match.homeTeam.name}</h3>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center">
                        {match.status === 'Finalizado' ? (
                            <div className="flex items-center gap-4">
                                <span className="text-5xl md:text-7xl font-black text-white drops-shadow-[0_0_15px_rgba(255,255,255,0.5)] font-mono">
                                    {match.score.home}
                                </span>
                                <span className="text-gray-600 text-4xl">-</span>
                                <span className="text-5xl md:text-7xl font-black text-white drops-shadow-[0_0_15px_rgba(255,255,255,0.5)] font-mono">
                                    {match.score.away}
                                </span>
                            </div>
                        ) : (
                            <span className="text-4xl font-black text-gray-600 tracking-widest">VS</span>
                        )}
                        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${match.status === 'Finalizado' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                            {match.status}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                            <Shield className="text-red-400 w-10 h-10 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-white font-black text-lg md:text-2xl leading-tight">{match.awayTeam.name}</h3>
                    </div>
                </div>
            </div>

            {/* Scorers Section */}
            <div className="w-full">
                <h3 className="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-yellow-500">
                    Goleadores
                </h3>

                {match.status === 'Finalizado' && match.goals.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {match.goals.map((goal, index) => (
                            <div key={index} className="flex items-center justify-between bg-[#1e293b]/60 backdrop-blur-md border border-white/5 rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                        {goal.player.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm">{goal.player}</span>
                                        <span className="text-xs text-gray-400">{goal.team}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded text-green-400 text-xs font-bold border border-green-500/20">
                                    ⚽ <span>{goal.minute}'</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
                        <Trophy className="text-gray-600 mb-2" size={40} />
                        <p className="text-gray-400 font-medium">Aún no hay resultado registrado.</p>
                        <p className="text-gray-500 text-xs text-balance">Los goles aparecerán aquí una vez finalice el partido.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MatchDetail;
