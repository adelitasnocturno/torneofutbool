import React, { useState, useEffect } from 'react';
import { Trophy, Footprints, Shield, User } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const Goleo = () => {
    const { tournamentId } = useTournament();
    const [scorers, setScorers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScorers = async () => {
            if (!tournamentId) return;
            try {
                const response = await client.get(`/tournaments/${tournamentId}/scorers`);
                // Backend returns list of ScorerDTO
                setScorers(response.data);
            } catch (error) {
                console.error("Error fetching top scorers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScorers();
    }, [tournamentId]);

    const getRankColor = (rank) => {
        if (rank === 1) return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]';
        if (rank === 2) return 'text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]';
        if (rank === 3) return 'text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]';
        return 'text-gray-400';
    };

    if (loading) return <div className="text-white text-center mt-10">Cargando tabla de goleo...</div>;

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6 px-4">

            {/* Header - Consistent Dark Glass visibility wrapper */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
                        <Footprints className="text-green-400 drop-shadow-lg -rotate-12" size={32} />
                        Tabla de Goleo
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full shadow-lg"></div>
                    </div>
                </div>
            </div>

            {/* Scorers List */}
            <div className="flex flex-col gap-3">
                {scorers.length === 0 ? (
                    <div className="text-center text-white/50 py-10">No hay goles registrados aún.</div>
                ) : (
                    scorers.map((player, index) => {
                        const rank = index + 1;
                        return (
                            <div
                                key={index}
                                className="group relative w-full bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-xl p-2 md:p-4 flex items-center justify-between cursor-pointer hover:border-green-400/50 hover:bg-[#1e293b]/90 transition-all duration-300 shadow-lg overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                                <div className="relative z-10 flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                                    {/* Rank */}
                                    <div className={`text-lg md:text-2xl font-black font-mono w-6 md:w-8 text-center flex-shrink-0 ${getRankColor(rank)}`}>
                                        {rank}
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex items-center justify-center bg-white/5
                                        ${rank === 1 ? 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' :
                                                rank === 2 ? 'border-gray-300' :
                                                    rank === 3 ? 'border-amber-600' : 'border-white/10'}`}>
                                            {player.playerPhotoUrl ? (
                                                <img src={player.playerPhotoUrl} alt={player.playerName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-gray-400" size={20} />
                                            )}
                                        </div>
                                        {/* Top 1 Crown */}
                                        {rank === 1 && (
                                            <div className="absolute -top-3 -right-1 text-yellow-400 drop-shadow-lg transform rotate-12">
                                                <Trophy size={14} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-white font-bold text-xs md:text-lg leading-tight group-hover:text-green-300 transition-colors truncate pr-1">
                                            {player.playerName}
                                        </span>
                                        <span className="text-gray-400 text-[10px] md:text-xs font-medium flex items-center gap-1 truncate">
                                            <Shield size={10} className="flex-shrink-0" />
                                            <span className="truncate"> {player.teamName}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Goals */}
                                <div className="flex flex-col items-center justify-center min-w-[40px] md:min-w-[50px] pl-2">
                                    <span className="text-xl md:text-3xl font-black text-white drop-shadow-md font-mono">
                                        {player.goalCount}
                                    </span>
                                    <span className="text-xl md:text-3xl text-green-400 font-bold uppercase tracking-wider text-[8px] md:text-[10px]">Goles</span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default Goleo;
