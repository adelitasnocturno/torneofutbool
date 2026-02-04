import React, { useState, useEffect } from 'react';
import { Trophy, User, Shield } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';
import playerCutout from '../assets/player_cutout.png';
import playerCutout2 from '../assets/player_cutout_2.png';

const ScorersCard = () => {
    const { tournamentId } = useTournament();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchScorers = async () => {
            if (!tournamentId) return;
            try {
                const response = await client.get(`/tournaments/${tournamentId}/scorers`);
                // Take top 5
                const data = response.data;
                setPlayers(data.slice(0, 5));
                if (data.length > 0) {
                    setSelectedId(data[0].playerId);
                }
            } catch (error) {
                console.error("Error fetching scorers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScorers();
    }, [tournamentId]);

    const selectedPlayer = players.find(p => p.playerId === selectedId);

    // Choose image based on ID (alternate) - Just a visual trick for now
    // In real app maybe use player.playerPhotoUrl if available
    const playerImage = selectedPlayer && selectedPlayer.playerId % 2 === 0 ? playerCutout2 : playerCutout;

    if (loading) {
        return <div className="p-4 text-center text-white/50">Cargando goleadores...</div>;
    }

    if (players.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a]/40 to-[#0f172a]/60 backdrop-blur-2xl rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-center items-center p-6 text-center">
                <p className="text-white/70 font-medium">Aún no hay registro de goles.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#1e3a8a]/40 to-[#0f172a]/60 backdrop-blur-2xl rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col relative group">

            {/* Header */}
            <div className="relative z-20 bg-gradient-to-r from-blue-900/80 to-transparent p-3 border-b border-white/10 shrink-0">
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-md">Top 5 Goleadores</h3>
            </div>

            {/* Table Header */}
            <div className="relative z-20 flex bg-[#0f172a]/40 text-xs font-bold text-blue-200 py-2 px-4 uppercase tracking-wider shrink-0">
                <div className="w-8 text-center">#</div>
                <div className="flex-1 text-left pl-2">Equipo</div>
                <div className="w-12 text-center">Gol</div>
            </div>

            {/* Content Container */}
            <div className="flex-1 relative overflow-hidden flex">

                {/* List Section */}
                <div className="w-full relative z-20 flex flex-col">
                    {players.map((player, index) => {
                        const isSelected = selectedId === player.playerId;
                        return (
                            <div
                                key={player.playerId}
                                onClick={() => setSelectedId(player.playerId)}
                                className={`flex items-center py-2.5 px-4 cursor-pointer transition-all duration-300 border-b border-white/5 relative
                                    ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                                `}
                            >
                                {/* Selection Highlight Indicator */}
                                {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                                )}

                                {/* Team Shield/Icon */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border ${isSelected ? 'border-white bg-blue-600' : 'border-gray-500 bg-gray-800'}`}>
                                    <Shield size={14} className={isSelected ? 'text-white' : 'text-gray-400'} fill="currentColor" fillOpacity={0.3} />
                                </div>

                                {/* Player Info */}
                                <div className="flex-1 flex flex-col z-10">
                                    <span className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                        {player.playerName}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter mt-0.5">
                                        {player.teamShortName || player.teamName}
                                    </span>
                                </div>

                                {/* Small Goal Count (Visible only when NOT selected) */}
                                <div className={`w-12 text-center font-bold text-lg transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'text-gray-400 opacity-100'}`}>
                                    {player.goalCount}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Hero / Visualization Layer (Absolute Overlay on Right) */}
                <div className="absolute top-0 right-0 bottom-0 w-[45%] pointer-events-none z-10">

                    {/* Dynamic Content for Selected Player */}
                    {selectedPlayer && (
                        <div key={selectedPlayer.playerId} className="w-full h-full relative flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500">

                            {/* Big Goal Number Background */}
                            <div className="absolute top-4 right-4 text-8xl font-black text-white/5 leading-none select-none">
                                {selectedPlayer.goalCount}
                            </div>

                            {/* Silhouette */}
                            <div className="relative z-10 flex-1 w-full flex items-end justify-center pb-2">
                                {/* Glow behind head */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/30 blur-[40px] rounded-full"></div>

                                <img
                                    src={playerImage}
                                    alt="Player"
                                    className="relative h-[180px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform translate-y-2"
                                />
                            </div>

                            {/* Goals Label with Trophy */}
                            <div className="relative z-20 flex items-center gap-1.5 mb-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-400/50 shadow-lg transform rotate-[-2deg]">
                                <Trophy size={14} className="text-yellow-400" fill="currentColor" />
                                <span className="text-white font-bold text-sm tracking-tight">
                                    +{selectedPlayer.goalCount} <span className="text-blue-300 font-normal">Goles</span>
                                </span>
                            </div>

                            {/* Big Number near head */}
                            <div className="absolute top-6 right-2 text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                {selectedPlayer.goalCount}
                            </div>

                        </div>
                    )}

                    {/* Gradient Fade to merge with list */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#172554]/0 via-[#172554]/50 to-transparent"></div>
                </div>

            </div>
        </div>
    );
};

export default ScorersCard;
