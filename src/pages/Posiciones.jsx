import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Trophy, ChevronRight } from 'lucide-react';

const Posiciones = () => {
    const navigate = useNavigate();

    // Mock Data - Full Stats
    const standings = [
        { id: 1, pos: 1, team: 'Las Adelitas', played: 5, won: 4, drawn: 1, lost: 0, gf: 12, ga: 3, gd: 9, pts: 13 },
        { id: 2, pos: 2, team: 'Guerreras', played: 5, won: 3, drawn: 2, lost: 0, gf: 10, ga: 5, gd: 5, pts: 11 },
        { id: 3, pos: 3, team: 'Fénix', played: 5, won: 3, drawn: 0, lost: 2, gf: 8, ga: 6, gd: 2, pts: 9 },
        { id: 4, pos: 4, team: 'Cobras FC', played: 5, won: 2, drawn: 1, lost: 2, gf: 7, ga: 8, gd: -1, pts: 7 },
        { id: 5, pos: 5, team: 'Águilas', played: 5, won: 1, drawn: 1, lost: 3, gf: 4, ga: 9, gd: -5, pts: 4 },
        { id: 6, pos: 6, team: 'Leonesses', played: 5, won: 0, drawn: 1, lost: 4, gf: 2, ga: 12, gd: -10, pts: 1 },
    ];

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6">
            {/* Header - Wrapped in Glass for Contrast */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
                        <Trophy className="text-yellow-400 drop-shadow-lg" size={32} />
                        Tabla General
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
                    </div>
                </div>
            </div>

            {/* Table Container - Dark Glass for Readability */}
            <div className="w-full bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Decorative & Title within Card */}
                <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <span className="text-blue-200/60 text-xs font-bold uppercase tracking-wider">Temporada 2026</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-[#1e293b]/50 text-blue-200/80 text-xs uppercase font-bold tracking-wider">
                                <th className="p-4 text-center w-12">Pos</th>
                                <th className="p-4 text-left">Equipo</th>
                                <th className="p-4 text-center">PJ</th>
                                <th className="p-4 text-center">PG</th>
                                <th className="p-4 text-center">PE</th>
                                <th className="p-4 text-center">PP</th>
                                <th className="p-4 text-center text-gray-400">GF</th>
                                <th className="p-4 text-center text-gray-400">GC</th>
                                <th className="p-4 text-center text-gray-300">DG</th>
                                <th className="p-4 text-center text-yellow-400 text-sm">PTS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {standings.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => navigate(`/equipo/${row.id}`)}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    {/* POS */}
                                    <td className="p-4 text-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                            ${row.pos <= 3 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-400 bg-white/5'}`}>
                                            {row.pos}
                                        </div>
                                    </td>

                                    {/* EQUIPO */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                                                <Shield size={16} className="text-blue-300" />
                                            </div>
                                            <span className="text-white font-bold text-sm md:text-base group-hover:text-yellow-200 transition-colors">
                                                {row.team}
                                            </span>
                                        </div>
                                    </td>

                                    {/* STATS */}
                                    <td className="p-4 text-center text-white font-medium">{row.played}</td>
                                    <td className="p-4 text-center text-green-400/80">{row.won}</td>
                                    <td className="p-4 text-center text-gray-400">{row.drawn}</td>
                                    <td className="p-4 text-center text-red-400/80">{row.lost}</td>
                                    <td className="p-4 text-center text-gray-500 text-xs hidden md:table-cell">{row.gf}</td>
                                    <td className="p-4 text-center text-gray-500 text-xs hidden md:table-cell">{row.ga}</td>
                                    <td className="p-4 text-center text-white font-bold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                                    <td className="p-4 text-center">
                                        <span className="text-yellow-400 font-black text-lg drop-shadow-sm">{row.pts}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Posiciones;
