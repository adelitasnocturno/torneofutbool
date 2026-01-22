import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Trophy, Users, Activity } from 'lucide-react';
import client from '../api/client';

const EquipoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Parallel fetch for speed
                const [teamRes, playersRes] = await Promise.all([
                    client.get(`/teams/${id}`),
                    client.get(`/teams/${id}/players`)
                ]);

                setTeam(teamRes.data);
                setPlayers(playersRes.data);
            } catch (error) {
                console.error("Error fetching team details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTeamData();
        }
    }, [id]);

    if (loading) return <div className="text-white text-center mt-10">Cargando equipo...</div>;
    if (!team) return <div className="text-white text-center mt-10">Equipo no encontrado.</div>;

    return (
        <div className="w-full min-h-screen pb-24 flex flex-col gap-6 px-4">

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
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
                            {team.logoUrl ? (
                                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield className="text-blue-400" size={48} />
                            )}
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl text-balance">
                                {team.name}
                            </h2>
                            <span className="text-blue-200/80 font-medium text-lg flex items-center gap-2">
                                <Users size={18} /> Plantel Oficial
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Squad List */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="text-blue-300" />
                    Jugadoras
                </h3>

                {players.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">No hay jugadoras registradas aún.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {players.map((player) => (
                            <div key={player.id} className="flex items-center gap-3 bg-[#1e293b]/60 border border-white/5 rounded-lg p-3 hover:bg-[#1e293b] transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/10 overflow-hidden relative">
                                    {player.photoUrl ? (
                                        <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg">{player.fullName.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm group-hover:text-blue-200 transition-colors">
                                        {player.fullName}
                                    </span>
                                    {/* Backend usually provides simplified roles or we use defaults */}
                                    <span className="text-gray-400 text-xs">{player.nickname || 'Jugadora'}</span>
                                </div>
                                <div className="ml-auto text-xl font-black text-white/10 font-mono group-hover:text-white/20 transition-colors">
                                    #{player.shirtNumber || '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default EquipoDetail;
