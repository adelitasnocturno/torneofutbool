import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Users } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const Equipos = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!tournamentId) return;

            try {
                const response = await client.get(`/tournaments/${tournamentId}/teams`);
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [tournamentId]);

    if (loading) return <div className="text-white text-center mt-10">Cargando equipos...</div>;

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6 px-4">

            {/* Header - Consistent Dark Glass visibility wrapper */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-2xl mt-4">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
                        <Users className="text-blue-400 drop-shadow-lg" size={32} />
                        Equipos Participantes
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full shadow-lg"></div>
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {teams.length === 0 ? (
                    <div className="col-span-full text-center text-white/50 py-10">No hay equipos registrados.</div>
                ) : (
                    teams.map((team) => (
                        <div
                            key={team.id}
                            onClick={() => navigate(`/equipo/${team.id}`)}
                            className="group relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1 hover:border-blue-400/50 hover:bg-[#1e293b]/90 transition-all duration-300 shadow-xl overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                            {/* Logo Placeholder */}
                            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:border-blue-400/30 transition-all duration-300 overflow-hidden">
                                {team.logoUrl ? (
                                    <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Shield className="text-blue-400 group-hover:text-blue-300 transition-colors" size={48} />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center text-center gap-1 z-10">
                                <h3 className="text-white font-black text-lg md:text-xl leading-tight group-hover:text-blue-200 transition-colors">
                                    {team.name}
                                </h3>
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                    Ver Plantel
                                </span>
                            </div>

                            {/* Action Hint */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="text-blue-400" size={20} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Equipos;
