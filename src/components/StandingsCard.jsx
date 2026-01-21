import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const StandingsCard = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await client.get(`/tournaments/${tournamentId}/standings`);
                // Take top 5 for the card
                const data = response.data;
                setStandings(data.slice(0, 5));
                if (data.length > 0) {
                    setSelectedId(data[0].teamId); // Default to leader
                }
            } catch (error) {
                console.error("Error fetching standings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tournamentId) {
            fetchStandings();
        }
    }, [tournamentId]);

    if (loading) {
        return <div className="p-4 text-center text-white/50">Cargando tabla...</div>;
    }

    if (standings.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a]/40 to-[#1e293b]/90 backdrop-blur-md rounded-xl overflow-hidden border border-blue-400/30 shadow-lg flex flex-col justify-center items-center p-6 text-center">
                <p className="text-white/70 font-medium">Aún no hay tabla de posiciones.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a]/40 to-[#1e293b]/90 backdrop-blur-md rounded-xl overflow-hidden border border-blue-400/30 shadow-lg flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e40af]/60 to-transparent p-3 border-b border-white/10">
                <h3 className="text-white font-bold text-lg tracking-wide">Top 5 Tabla</h3>
            </div>

            {/* Table Header */}
            <div className="flex bg-[#0f172a]/60 text-xs font-bold text-blue-200 py-2 px-4 uppercase tracking-wider">
                <div className="w-8">#</div>
                <div className="flex-1 text-left">Equipo</div>
                <div className="w-8 text-center">PJ</div>
                <div className="w-8 text-center">DG</div>
                <div className="w-8 text-center text-white">PTS</div>
            </div>

            {/* Rows */}
            <div className="flex-1 flex flex-col">
                {standings.map((row, index) => {
                    const isSelected = selectedId === row.teamId;
                    return (
                        <div
                            key={row.teamId}
                            onClick={() => setSelectedId(row.teamId)}
                            className={`flex items-center py-2 px-4 text-sm border-b border-white/5 last:border-0 cursor-pointer transition-all duration-300 ${isSelected
                                ? 'bg-gradient-to-r from-yellow-600/80 to-yellow-500/20 text-white font-semibold relative overflow-hidden scale-[1.02] z-10 border-t border-b border-yellow-400/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                : 'text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse"></div>
                            )}
                            <div className="w-8 font-medium">{index + 1}.</div>
                            <div className="flex-1 font-medium">{row.teamName}</div>
                            <div className="w-8 text-center text-gray-400">{row.matchesPlayed}</div>
                            <div className="w-8 text-center font-bold text-gray-300">{row.goalDifference > 0 ? '+' + row.goalDifference : row.goalDifference}</div>
                            <div className={`w-8 text-center font-black ${isSelected ? 'text-yellow-300' : 'text-white'}`}>{row.points}</div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Button */}
            <div className="p-3 mt-auto">
                <button
                    onClick={() => navigate('/posiciones')}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white text-sm font-bold py-2 rounded shadow-lg border border-yellow-300/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    Ver tabla completa
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default StandingsCard;
