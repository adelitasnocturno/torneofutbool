import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Trophy, ChevronRight } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const Posiciones = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            // Avoid fetching if no tournament selected
            if (!tournamentId) return;

            try {
                const response = await client.get(`/tournaments/${tournamentId}/standings`);
                // Backend returns list of DTOs: { position, teamId, teamName, played, won, drawn, lost, points, goalsFor, goalsAgainst, goalDifference, ... }
                // We need to map this to our component state
                // Note: Backend might return 'teamName', verify DTO. Usually it's teamName.
                // Let's assume the keys match the backend DTO I inspected earlier.
                setStandings(response.data);
            } catch (error) {
                console.error("Error fetching standings:", error);
                // Fallback to empty array
                setStandings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [tournamentId]);

    const getPosColor = (pos) => {
        if (pos === 1) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        if (pos <= 3) return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'; // Top 3
        return 'text-gray-400 bg-white/5';
    };

    if (loading) return <div className="text-white text-center mt-10">Cargando tabla...</div>;

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6 px-4">
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
                    {standings.length === 0 ? (
                        <div className="p-10 text-center text-white/50">
                            No hay datos de tabla disponibles aún.
                        </div>
                    ) : (
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
                                        key={row.teamId}
                                        onClick={() => navigate(`/equipo/${row.teamId}`)}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        {/* POS */}
                                        <td className="p-4 text-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getPosColor(row.position)}`}>
                                                {row.position}
                                            </div>
                                        </td>

                                        {/* EQUIPO */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                                    {/* Use Logo URL if available, else Shield */}
                                                    {row.logoUrl ? (
                                                        <img src={row.logoUrl} alt={row.teamName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Shield size={16} className="text-blue-300" />
                                                    )}
                                                </div>
                                                <span className="text-white font-bold text-sm md:text-base group-hover:text-yellow-200 transition-colors">
                                                    {row.teamName}
                                                </span>
                                            </div>
                                        </td>

                                        {/* STATS */}
                                        <td className="p-4 text-center text-white font-medium">{row.played}</td>
                                        <td className="p-4 text-center text-green-400/80">{row.won}</td>
                                        <td className="p-4 text-center text-gray-400">{row.drawn}</td>
                                        <td className="p-4 text-center text-red-400/80">{row.lost}</td>
                                        <td className="p-4 text-center text-gray-500 text-xs hidden md:table-cell">{row.goalsFor}</td>
                                        <td className="p-4 text-center text-gray-500 text-xs hidden md:table-cell">{row.goalsAgainst}</td>
                                        <td className="p-4 text-center text-white font-bold">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                                        <td className="p-4 text-center">
                                            <span className="text-yellow-400 font-black text-lg drop-shadow-sm">{row.points}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Posiciones;
