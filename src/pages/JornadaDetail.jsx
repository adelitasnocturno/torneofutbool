import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Shield, Calendar } from 'lucide-react';

const JornadaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data based on ID
    const jornadaInfo = {
        name: `Jornada ${id}`,
        date: 'Martes 10/01/2026',
        status: 'Finalizada'
    };

    const matches = [
        {
            id: 101,
            time: '19:00',
            court: 'Cancha 1',
            status: 'Finalizado',
            homeTeam: 'Las Adelitas',
            awayTeam: 'Cobras FC',
            score: { home: 3, away: 1 }
        },
        {
            id: 102,
            time: '20:00',
            court: 'Cancha 2',
            status: 'Finalizado',
            homeTeam: 'Guerreras',
            awayTeam: 'Águilas',
            score: { home: 2, away: 2 }
        },
        {
            id: 103,
            time: '21:00',
            court: 'Cancha 1',
            status: 'Programada',
            homeTeam: 'Fénix',
            awayTeam: 'Leonesses',
            score: null
        }
    ];

    return (
        <div className="w-full min-h-screen pb-24">
            {/* Header Section - Wrapped in Glass for Contrast */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="relative z-10 flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit group mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-wide">Volver</span>
                </button>

                <div className="relative z-10 flex flex-col gap-1">
                    <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                        {jornadaInfo.name}
                    </h2>
                    <div className="flex items-center gap-2 text-blue-200/90 font-medium text-lg">
                        <Calendar size={20} className="text-yellow-400" />
                        {jornadaInfo.date}
                    </div>
                </div>
            </div>

            {/* Match List */}
            <div className="flex flex-col gap-4">
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className="group relative w-full bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-xl p-4 cursor-pointer hover:border-yellow-400/50 hover:bg-[#1e293b]/90 transition-all duration-300 overflow-hidden shadow-xl"
                        onClick={() => navigate(`/match/${match.id}`)}
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-yellow-500/10 group-hover:to-transparent transition-all duration-500"></div>

                        {/* Card Content - Grid Layout */}
                        <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

                            {/* Home Team (Left) */}
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="text-blue-400" size={28} />
                                </div>
                                <span className="text-white font-bold text-sm md:text-base leading-tight">
                                    {match.homeTeam}
                                </span>
                            </div>

                            {/* Center Info (Score or Time) */}
                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                                {match.status === 'Finalizado' ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl md:text-4xl font-black text-white drop-shadow-lg font-mono">
                                            {match.score.home}
                                        </span>
                                        <span className="text-gray-500 font-bold">-</span>
                                        <span className="text-3xl md:text-4xl font-black text-white drop-shadow-lg font-mono">
                                            {match.score.away}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                                            <Clock size={12} />
                                            {match.time}
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                            <MapPin size={10} />
                                            {match.court}
                                        </span>
                                    </div>
                                )}

                                <span className={`mt-2 text-[10px] uppercase tracking-widest font-bold 
                                    ${match.status === 'Finalizado' ? 'text-green-400' : 'text-gray-400'}`}>
                                    {match.status}
                                </span>
                            </div>

                            {/* Away Team (Right) */}
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="text-red-400" size={28} />
                                </div>
                                <span className="text-white font-bold text-sm md:text-base leading-tight">
                                    {match.awayTeam}
                                </span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JornadaDetail;
