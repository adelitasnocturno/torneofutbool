import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Save,
    Trophy,
    User,
    Plus,
    Trash2,
    Timer,
    CheckCircle,
    Shield
} from 'lucide-react';

const AdminMatchResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock Match Data
    const [match, setMatch] = useState({
        id: id,
        localTeam: { id: 1, name: 'Tigres' },
        visitorTeam: { id: 2, name: 'Atlético' },
        localScore: 2,
        visitorScore: 1,
        status: 'FINAL', // 'PENDING', 'LIVE', 'FINAL'
    });

    // Mock Players Data (Merged for simplicity in this view, usually fetched by team ID)
    const players = {
        1: [ // Tigres
            { id: 101, name: 'Carlos Ruiz', number: 10 },
            { id: 102, name: 'Juan Pérez', number: 8 },
        ],
        2: [ // Atlético
            { id: 201, name: 'Luis Hernández', number: 9 },
            { id: 202, name: 'Miguel Silva', number: 1 },
        ]
    };

    // Mock Scorers List
    const [scorers, setScorers] = useState([
        { id: 1, teamId: 1, playerId: 101, time: '15' }, // Tigres Goal
        { id: 2, teamId: 2, playerId: 201, time: '32' }, // Atlético Goal
        { id: 3, teamId: 1, playerId: 101, time: '88' }, // Tigres Goal
    ]);

    // Form States
    const [selectedTeamId, setSelectedTeamId] = useState(match.localTeam.id);
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Derived State
    const currentTeamPlayers = players[selectedTeamId] || [];

    // Handlers
    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!selectedPlayerId) return;

        const newGoal = {
            id: Date.now(),
            teamId: parseInt(selectedTeamId),
            playerId: parseInt(selectedPlayerId),
            time: '-' // Could add time input if needed
        };

        // Update Scorers List
        setScorers([...scorers, newGoal]);

        // Auto-update Score (Optional convenience)
        if (parseInt(selectedTeamId) === match.localTeam.id) {
            setMatch({ ...match, localScore: match.localScore + 1 });
        } else {
            setMatch({ ...match, visitorScore: match.visitorScore + 1 });
        }

        setSelectedPlayerId('');
    };

    const handleRemoveGoal = (goalId, teamId) => {
        setScorers(scorers.filter(g => g.id !== goalId));

        // Auto-decrement Score
        if (teamId === match.localTeam.id) {
            setMatch({ ...match, localScore: Math.max(0, match.localScore - 1) });
        } else {
            setMatch({ ...match, visitorScore: Math.max(0, match.visitorScore - 1) });
        }
    };

    const handleSaveResult = () => {
        console.log('Saving result:', match, scorers);
        setSuccessMessage('¡Resultado actualizado correctamente!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const getPlayerName = (pid, tid) => {
        const p = players[tid]?.find(p => p.id === pid);
        return p ? p.name : 'Desconocido';
    };

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

                        {/* Score Inputs */}
                        <div className="flex items-center justify-between gap-4 mb-8">
                            {/* Local */}
                            <div className="flex flex-col items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg">
                                    <Shield size={32} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white text-center">{match.localTeam.name}</h3>
                                <input
                                    type="number"
                                    min="0"
                                    value={match.localScore}
                                    onChange={(e) => setMatch({ ...match, localScore: parseInt(e.target.value) || 0 })}
                                    className="w-24 h-24 bg-[#1e293b] border-2 border-white/10 rounded-2xl text-5xl font-black text-white text-center focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            <span className="text-4xl font-black text-gray-600">-</span>

                            {/* Visitor */}
                            <div className="flex flex-col items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg">
                                    <Shield size={32} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white text-center">{match.visitorTeam.name}</h3>
                                <input
                                    type="number"
                                    min="0"
                                    value={match.visitorScore}
                                    onChange={(e) => setMatch({ ...match, visitorScore: parseInt(e.target.value) || 0 })}
                                    className="w-24 h-24 bg-[#1e293b] border-2 border-white/10 rounded-2xl text-5xl font-black text-white text-center focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                />
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
                                <option value="PENDING">Pendiente / Por Jugar</option>
                                <option value="LIVE">En Vivo / Jugando</option>
                                <option value="FINAL">Finalizado</option>
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
                                        <option value={match.localTeam.id}>{match.localTeam.name}</option>
                                        <option value={match.visitorTeam.id}>{match.visitorTeam.name}</option>
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
                                            <option key={p.id} value={p.id}>#{p.number} {p.name}</option>
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
                                scorers.map((goal, index) => (
                                    <div key={goal.id} className="flex items-center justify-between bg-[#1e293b] p-3 rounded-xl border border-white/5 animate-in slide-in-from-right-2" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${goal.teamId === match.localTeam.id ? 'bg-blue-600/20 text-blue-300' : 'bg-red-600/20 text-red-300'}`}>
                                                {goal.teamId === match.localTeam.id ? 'L' : 'V'}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{getPlayerName(goal.playerId, goal.teamId)}</p>
                                                <p className="text-xs text-gray-400">
                                                    {goal.teamId === match.localTeam.id ? match.localTeam.name : match.visitorTeam.name}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveGoal(goal.id, goal.teamId)}
                                            className="text-gray-500 hover:text-red-400 p-2 transition-colors"
                                            title="Eliminar gol"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminMatchResult;
