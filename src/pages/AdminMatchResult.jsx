import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import {
    ChevronLeft,
    Save,
    Trophy,
    User,
    Plus,
    Trash2,
    Timer,
    CheckCircle,
    Shield,
    Loader2
} from 'lucide-react';

const AdminMatchResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState({}); // { teamId: [Player] }
    const [scorers, setScorers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const matchRes = await client.get(`/matches/${id}`);
            const fetchedMatch = matchRes.data;
            setMatch(fetchedMatch);

            // Fetch Goals
            const goalsRes = await client.get(`/matches/${id}/goals`);
            setScorers(goalsRes.data);

            // Fetch Players for both teams
            const homePlayersRes = await client.get(`/teams/${fetchedMatch.homeTeam?.id}/players`);
            const awayPlayersRes = await client.get(`/teams/${fetchedMatch.awayTeam?.id}/players`);

            setPlayers({
                [fetchedMatch.homeTeam.id]: homePlayersRes.data,
                [fetchedMatch.awayTeam.id]: awayPlayersRes.data
            });

            // Set default selected team
            setSelectedTeamId(fetchedMatch.homeTeam.id);

        } catch (error) {
            console.error("Error fetching match details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived State
    const currentTeamPlayers = players[selectedTeamId] || [];

    // Auto-calculate scores whenever scorers list changes
    useEffect(() => {
        if (!match || !scorers) return;

        const homeGoals = scorers.filter(g => {
            const tId = g.team ? g.team.id : g.teamId;
            return tId === match.homeTeam.id;
        }).length;

        const awayGoals = scorers.filter(g => {
            const tId = g.team ? g.team.id : g.teamId;
            return tId === match.awayTeam.id;
        }).length;

        setMatch(prev => ({
            ...prev,
            homeScore: homeGoals,
            awayScore: awayGoals
        }));
    }, [scorers]);

    // Handlers
    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!selectedPlayerId || !match) return;

        try {
            const goalDto = {
                matchId: parseInt(id),
                teamId: parseInt(selectedTeamId),
                playerId: parseInt(selectedPlayerId),
                minute: 0 // Optional: Add minute input later if needed
            };

            const res = await client.post('/goals', goalDto);

            // Update local state
            setScorers([...scorers, res.data]);

            // Score update is handled by useEffect now

            setSelectedPlayerId('');
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Error al agregar gol");
        }
    };

    const handleRemoveGoal = async (goalId, teamId) => {
        try {
            await client.delete(`/goals/${goalId}`);

            setScorers(scorers.filter(g => g.id !== goalId));

            // Score update is handled by useEffect now
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };

    const handleSaveResult = async () => {
        try {
            // Update Match global score and status
            const updatePayload = {
                status: match.status,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                date: match.date, // Include date to avoid wiping it
                scheduledTime: match.scheduledTime,
                venue: match.venue
            };

            await client.put(`/matches/${match.id}`, updatePayload);

            setSuccessMessage('¡Resultado actualizado correctamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error saving result:", error);
            alert("Error al guardar resultado");
        }
    };

    const getPlayerName = (goal) => {
        // Option 1: Use the player object inside the goal entity (if backend populates it)
        if (goal.player && goal.player.fullName) return goal.player.fullName;
        if (goal.player && goal.player.name) return goal.player.name;

        // Option 2: Fallback to players list lookup
        const teamId = goal.team ? goal.team.id : null;
        if (!teamId) return 'Desconocido';

        const teamPlayers = players[teamId] || [];
        const found = teamPlayers.find(p => p.id === goal.player?.id || p.id === goal.player);
        return found ? found.fullName : 'Jugador';
    };

    if (loading || !match) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-4 pb-20 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/partidos')}
                    className="bg-[#0f172a]/80 hover:bg-[#1e293b] p-2.5 rounded-full border border-white/20 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group"
                >
                    <ChevronLeft className="text-white group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white leading-none">Capturar Resultado</h1>
                    <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Edición de Partido</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Available for: Scoreboard & Status */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <Trophy className="text-yellow-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Marcador Global</h2>
                        </div>

                        {/* Score Inputs (Mobile Optimized) */}
                        <div className="flex items-center justify-between gap-2 md:gap-4 mb-8">
                            {/* Local */}
                            <div className="flex flex-col items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg shrink-0">
                                    <Shield className="text-white w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-white text-center truncate w-full block" title={match.homeTeam.name}>{match.homeTeam.name}</h3>
                                <div className="relative">
                                    <input
                                        type="number"
                                        readOnly
                                        value={match.homeScore}
                                        className="w-20 h-20 md:w-24 md:h-24 bg-black/40 border-2 border-white/5 rounded-2xl text-4xl md:text-5xl font-black text-white/50 text-center focus:outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl md:text-4xl font-black text-gray-600 shrink-0 mx-[-4px]">-</span>
                                <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Auto</span>
                            </div>

                            {/* Visitor */}
                            <div className="flex flex-col items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg shrink-0">
                                    <Shield className="text-white w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-white text-center truncate w-full block" title={match.awayTeam.name}>{match.awayTeam.name}</h3>
                                <div className="relative">
                                    <input
                                        type="number"
                                        readOnly
                                        value={match.awayScore}
                                        className="w-20 h-20 md:w-24 md:h-24 bg-black/40 border-2 border-white/5 rounded-2xl text-4xl md:text-5xl font-black text-white/50 text-center focus:outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Selector */}
                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-bold text-blue-200 uppercase tracking-wide flex items-center gap-2">
                                <Timer size={14} /> Estado del Partido
                            </label>
                            <select
                                value={match.status}
                                onChange={(e) => setMatch({ ...match, status: e.target.value })}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                            >
                                <option value="SCHEDULED">Pendiente / Por Jugar</option>
                                <option value="IN_PROGRESS">En Vivo / Jugando</option>
                                <option value="FINAL">Finalizado</option>
                                <option value="CANCELLED">Cancelado</option>
                                <option value="POSTPONED">Pospuesto</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveResult}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-emerald-500/20"
                        >
                            <Save size={20} />
                            Guardar Resultado Global
                        </button>

                        {successMessage && (
                            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                                <CheckCircle className="text-emerald-400" size={18} />
                                <span className="text-emerald-300 font-medium">{successMessage}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scorers Section */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <User className="text-blue-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Goleadores</h2>
                        </div>

                        {/* Add Goal Form */}
                        <form onSubmit={handleAddGoal} className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Equipo</label>
                                    <select
                                        value={selectedTeamId}
                                        onChange={(e) => {
                                            setSelectedTeamId(parseInt(e.target.value));
                                            setSelectedPlayerId('');
                                        }}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value={match.homeTeam.id}>{match.homeTeam.name}</option>
                                        <option value={match.awayTeam.id}>{match.awayTeam.name}</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Jugador</label>
                                    <select
                                        value={selectedPlayerId}
                                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {currentTeamPlayers.map(p => (
                                            <option key={p.id} value={p.id}>#{p.shirtNumber} {p.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedPlayerId}
                                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/20 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={16} />
                                Agregar Gol
                            </button>
                        </form>

                        {/* Scorers List */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[400px]">
                            {scorers.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 italic">Sin goles registrados.</p>
                            ) : (
                                scorers.map((goal, index) => {
                                    // goal.team might be just ID or object. usually object in standard JPA json
                                    const teamId = goal.team ? goal.team.id : null;
                                    const isHomeGoal = teamId === match.homeTeam.id;

                                    return (
                                        <div key={goal.id} className="flex items-center justify-between bg-[#1e293b] p-3 rounded-xl border border-white/5 animate-in slide-in-from-right-2" style={{ animationDelay: `${index * 50}ms` }}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isHomeGoal ? 'bg-blue-600/20 text-blue-300' : 'bg-red-600/20 text-red-300'}`}>
                                                    {isHomeGoal ? 'L' : 'V'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{getPlayerName(goal)}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {isHomeGoal ? match.homeTeam.name : match.awayTeam.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveGoal(goal.id, teamId)}
                                                className="text-gray-500 hover:text-red-400 p-2 transition-colors"
                                                title="Eliminar gol"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminMatchResult;
