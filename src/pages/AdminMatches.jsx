import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Calendar,
    Clock,
    MapPin,
    Pencil,
    Trash2,
    X,
    Save,
    Swords,
    AlertTriangle,
    Shield,
    Trophy
} from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const AdminMatches = () => {
    const navigate = useNavigate();

    const { tournamentId } = useTournament();

    // Data States
    const [matchdays, setMatchdays] = useState([]);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [selectedMatchday, setSelectedMatchday] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState(null);
    const [formData, setFormData] = useState({ local: '', visitor: '', time: '', court: '' });

    // Fetch MatchDays and Teams on load
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!tournamentId) return;
            try {
                const [matchdaysRes, teamsRes] = await Promise.all([
                    client.get(`/tournaments/${tournamentId}/matchdays`),
                    client.get(`/tournaments/${tournamentId}/teams`)
                ]);
                setMatchdays(matchdaysRes.data);
                setTeams(teamsRes.data);

                // Select first matchday by default if available
                if (matchdaysRes.data.length > 0) {
                    setSelectedMatchday(matchdaysRes.data[0].id);
                }
            } catch (err) {
                console.error("Error loading initial data:", err);
                setError("No se pudieron cargar las jornadas o equipos.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [tournamentId]);

    // Fetch Matches when selectedMatchday changes
    useEffect(() => {
        const fetchMatches = async () => {
            if (!selectedMatchday) return;
            try {
                const response = await client.get(`/matchdays/${selectedMatchday}/matches`);
                setMatches(response.data);
            } catch (err) {
                console.error("Error loading matches:", err);
            }
        };
        fetchMatches();
    }, [selectedMatchday]);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState(null);

    // Validation
    const [error, setError] = useState('');

    // Filter Matches
    const filteredMatches = matches.filter(m => m.matchdayId === parseInt(selectedMatchday));

    // Handlers
    const handleOpenModal = (match = null) => {
        setError('');
        if (match) {
            setEditingMatch(match);
            setFormData({
                local: match.homeTeam.id,
                visitor: match.awayTeam.id,
                time: match.scheduledTime ? match.scheduledTime.substring(0, 5) : '',
                court: match.venue
            });
        } else {
            setEditingMatch(null);
            setFormData({ local: '', visitor: '', time: '', court: '' });
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMatch(null);
        setFormData({ local: '', visitor: '', time: '', court: '' });
        setError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation: Local != Visitor
        if (formData.local === formData.visitor) {
            setError('El equipo local y visitante no pueden ser el mismo.');
            return;
        }

        try {
            const payload = {
                tournament: { id: parseInt(tournamentId) },
                matchDay: { id: parseInt(selectedMatchday) },
                homeTeam: { id: parseInt(formData.local) },
                awayTeam: { id: parseInt(formData.visitor) },
                scheduledTime: formData.time ? `${formData.time}:00` : null,
                venue: formData.court,
                status: 'SCHEDULED'
            };

            if (editingMatch) {
                // Update
                const response = await client.put(`/matches/${editingMatch.id}`, { ...payload, status: editingMatch.status });
                setMatches(matches.map(m => m.id === editingMatch.id ? response.data : m));
            } else {
                // Create
                const response = await client.post('/matches', payload);
                setMatches([...matches, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Error saving match:", err);
            setError("Error al guardar el partido. Verifica los datos.");
        }
    };

    const handleDeleteClick = (match) => {
        setMatchToDelete(match);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (matchToDelete) {
            try {
                await client.delete(`/matches/${matchToDelete.id}`);
                setMatches(matches.filter(m => m.id !== matchToDelete.id));
                setIsDeleteModalOpen(false);
                setMatchToDelete(null);
            } catch (err) {
                console.error("Error deleting match:", err);
                setError("Error al eliminar el partido.");
                setIsDeleteModalOpen(false); // Close modal anyway
            }
        }
    };

    const getTeamName = (id) => teams.find(t => t.id == id)?.name || 'Desconocido';

    return (
        <div className="min-h-screen w-full p-4 pb-20 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-[#0f172a]/80 hover:bg-[#1e293b] p-2.5 rounded-full border border-white/20 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group"
                    >
                        <ChevronLeft className="text-white group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-none">Gestión de Partidos</h1>
                        <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Programación</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Matchday Selector */}
                    <div className="relative w-full md:w-64">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                        <select
                            value={selectedMatchday}
                            onChange={(e) => setSelectedMatchday(e.target.value)}
                            className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-blue-400 cursor-pointer"
                        >
                            {matchdays.map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Agregar Partido</span>
                    </button>
                </div>
            </div>

            {/* Matches List */}
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {filteredMatches.length === 0 ? (
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 text-center">
                        <Swords className="text-gray-600 mx-auto mb-3" size={48} />
                        <p className="text-gray-400">No hay partidos programados para esta jornada.</p>
                    </div>
                ) : (
                    filteredMatches.map(match => (
                        <div
                            key={match.id}
                            className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-lg hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                                {/* Teams VS */}
                                <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center md:justify-start">
                                    <div className="flex flex-col items-center gap-2 w-24">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10">
                                            <Shield size={20} className="text-gray-500" />
                                        </div>
                                        <span className="text-sm font-bold text-white text-center leading-tight">{getTeamName(match.local)}</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-black text-blue-500/50">VS</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 w-24">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10">
                                            <Shield size={20} className="text-gray-500" />
                                        </div>
                                        <span className="text-sm font-bold text-white text-center leading-tight">{getTeamName(match.visitor)}</span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 text-sm text-gray-400">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <Clock size={14} className="text-blue-400" />
                                        <span>{match.time || '--:--'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <MapPin size={14} className="text-emerald-400" />
                                        <span>{match.court || 'Por definir'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-2 md:mt-0 justify-end">
                                    <button
                                        onClick={() => navigate(`/admin/partidos/${match.id}/resultado`)}
                                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                                        title="Capturar Resultado"
                                    >
                                        <Trophy size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(match)}
                                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(match)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingMatch ? 'Editar Partido' : 'Programar Partido'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-6">

                            {/* Teams Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Local</label>
                                    <select
                                        required
                                        value={formData.local}
                                        onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Visitante</label>
                                    <select
                                        required
                                        value={formData.visitor}
                                        onChange={(e) => setFormData({ ...formData, visitor: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Details Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Hora</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Cancha</label>
                                    <input
                                        type="text"
                                        value={formData.court}
                                        onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                        placeholder="Ej. Cancha 1"
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Validation Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm font-medium flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {editingMatch ? 'Guardar Cambios' : 'Agendar Partido'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-[#0f172a] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">¿Eliminar Partido?</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all active:scale-95">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMatches;
