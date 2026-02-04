import React, { useState, useEffect } from 'react';
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
    AlertCircle,
    Shield,
    Trophy,
    Dices,
    CalendarClock
} from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const AdminMatches = () => {
    const navigate = useNavigate();

    const { tournamentId, matchDays: contextMatchDays, refreshData } = useTournament();

    // Data States
    // const [matchdays, setMatchdays] = useState([]); // Removed in favor of Context
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use context matchdays directly (alias to local variable name for minimal refactor)
    // Ensure it is ALWAYS an array to avoid map errors
    const matchdays = Array.isArray(contextMatchDays) ? contextMatchDays : [];

    // UI States
    const [selectedMatchday, setSelectedMatchday] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState(null);
    const [formData, setFormData] = useState({ local: '', visitor: '', time: '', court: '' });

    // Fetch Teams AND Refresh MatchDays on load
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!tournamentId) return;
            try {
                // 1. Fetch Teams
                const teamsRes = await client.get(`/tournaments/${tournamentId}/teams`);
                setTeams(teamsRes.data);

                // 2. Refresh Context Data (MatchDays) logic
                // Ensure we have the latest matchdays (e.g. if we just created one)
                if (refreshData) {
                    await refreshData();
                }
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [tournamentId]);

    // Default to Current Matchday based on Date (or Last created as fallback)
    useEffect(() => {
        if (matchdays.length > 0 && !selectedMatchday) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            const current = matchdays.find(d => {
                if (!d.startDate || !d.endDate) return false;
                return today >= d.startDate && today <= d.endDate;
            });

            if (current) {
                setSelectedMatchday(current.id);
            } else {
                // Determine if we should show first or last? 
                // Usually "Next" matchday is better than "Last History".
                // But let's stick to old behavior (Last) or maybe First?
                // Let's stick to Last for now as that was previous behavior, logic says 'most recent'.
                setSelectedMatchday(matchdays[matchdays.length - 1].id);
            }
        }
    }, [matchdays, selectedMatchday]);

    // Fetch Matches AND Availability when selectedMatchday changes
    useEffect(() => {
        const loadMatchdayData = async () => {
            if (!selectedMatchday) return;
            try {
                // Parallel fetch for speed
                const [matchesRes, availabilityRes] = await Promise.all([
                    client.get(`/matchdays/${selectedMatchday}/matches`),
                    client.get(`/matchdays/${selectedMatchday}/availability`)
                ]);
                setMatches(matchesRes.data);
                setAvailabilityList(availabilityRes.data);
            } catch (err) {
                console.error("Error loading matchday data:", err);
            }
        };
        loadMatchdayData();
    }, [selectedMatchday]);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState(null);

    // Regenerate Modal State
    const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

    // Availability State
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
    const [availabilityList, setAvailabilityList] = useState([]);
    const [newSlot, setNewSlot] = useState({ dayOfWeek: 'TUESDAY', startTime: '', endTime: '', fieldName: '' });

    // Explicit Fetch for manually refreshing list after add/delete (reusing logic implicitly or explicitly)
    const refreshAvailability = async () => {
        if (!selectedMatchday) return;
        try {
            const response = await client.get(`/matchdays/${selectedMatchday}/availability`);
            setAvailabilityList(response.data);
        } catch (error) { console.error(error); }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            await client.post(`/matchdays/${selectedMatchday}/availability`, {
                ...newSlot,
                startTime: `${newSlot.startTime}:00`,
                endTime: `${newSlot.endTime}:00`
            });
            setNewSlot({ dayOfWeek: 'TUESDAY', startTime: '', endTime: '', fieldName: '' });
            refreshAvailability();
        } catch (error) {
            console.error("Error adding slot:", error);
            alert("Error al agregar horario");
        }
    };

    const handleDeleteSlot = async (id) => {
        try {
            await client.delete(`/availability/${id}`);
            // Optimistic update
            setAvailabilityList(availabilityList.filter(slot => slot.id !== id));
        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    // ... (rest of code)




    // Feedback Modal State
    const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, title: '', message: '', type: 'error' }); // type: error, warning, success

    // Validation
    const [error, setError] = useState('');

    // Filter Matches
    // Filter Matches: (Backend already filters by ID, but we keep this for safety if structure matches, or just use matches directly)
    // The previous filter was failing because 'matchdayId' doesn't exist on the response (it has nested matchDay object).
    // Start using 'matches' directly since API guarantees they belong to selectedMatchday.
    // Filter out POSTPONED matches that have no scheduled time (they shouldn't be in the schedule view)
    const visibleMatches = matches.filter(m => !(m.status === 'POSTPONED' && !m.scheduledTime));

    const sortedMatches = [...visibleMatches].sort((a, b) => {
        // Sort by date first
        if (a.date && b.date && a.date !== b.date) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        // Then by time
        if (a.scheduledTime && b.scheduledTime && a.scheduledTime !== b.scheduledTime) {
            return a.scheduledTime.localeCompare(b.scheduledTime);
        }
        return 0;
    });


    // Handlers
    const handleOpenModal = (match = null) => {
        setError('');
        if (match) {
            setEditingMatch(match);
            setFormData({
                local: match.homeTeam.id,
                visitor: match.awayTeam.id,
                date: match.date || '',
                time: match.scheduledTime ? match.scheduledTime.substring(0, 5) : '',
                court: match.venue || ''
            });
        } else {
            setEditingMatch(null);
            setFormData({ local: '', visitor: '', date: '', time: '', court: '' });
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMatch(null);
        setFormData({ local: '', visitor: '', date: '', time: '', court: '' });
        setError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation: Local != Visitor
        if (formData.local === formData.visitor) {
            setError('El equipo local y visitante no pueden ser el mismo.');
            return;
        }

        // Validation: Required Fields (Slot Selector must be used)
        if (!formData.date || !formData.time || !formData.court) {
            setError('Debes seleccionar un Horario Disponible de la lista.');
            return;
        }

        // Validation: Teams already playing?
        const busyTeam = matches.find(m => {
            // Ignore current match if editing
            if (editingMatch && m.id === editingMatch.id) return false;

            const localId = parseInt(formData.local);
            const visitorId = parseInt(formData.visitor);

            // Check if ANY team in the new match is busy in an existing match
            return (m.homeTeam.id === localId || m.awayTeam.id === localId || m.homeTeam.id === visitorId || m.awayTeam.id === visitorId);
        });

        if (busyTeam) {
            const localId = parseInt(formData.local);
            const visitorId = parseInt(formData.visitor);
            let conflictingTeamName = '';

            if (busyTeam.homeTeam.id === localId || busyTeam.awayTeam.id === localId) conflictingTeamName = getTeamName(localId);
            if (busyTeam.homeTeam.id === visitorId || busyTeam.awayTeam.id === visitorId) conflictingTeamName = getTeamName(visitorId);

            setError(`El equipo '${conflictingTeamName}' ya tiene partido asignado en esta jornada contra ${busyTeam.homeTeam.id === parseInt(formData.local) || busyTeam.homeTeam.id === parseInt(formData.visitor) ? busyTeam.awayTeam.name : busyTeam.homeTeam.name}.`);
            return;
        }

        try {

            // Construct DTO payload (Simple IDs, no nested objects)
            const payload = {
                tournamentId: parseInt(tournamentId),
                matchDayId: parseInt(selectedMatchday), // selectedMatchday IS the ID
                homeTeamId: parseInt(formData.local),
                awayTeamId: parseInt(formData.visitor),
                date: formData.date,
                scheduledTime: formData.time.length === 5 ? `${formData.time}:00` : formData.time, // HH:mm:ss safe
                venue: formData.court
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

    const handleConfirmRegenerate = async () => {
        try {
            setLoading(true);
            const response = await client.post(`/matchdays/${selectedMatchday}/generate?force=true`);
            setMatches(response.data); // Replace all matches
            setIsRegenerateModalOpen(false);
            setFeedbackModal({
                isOpen: true,
                title: '¡Sorteo Regenerado!',
                message: `Se han creado ${response.data.length} nuevos cruces aleatorios.`,
                type: 'success'
            });
        } catch (err) {
            console.error("Error regenerating matches:", err);
            // Parse error message from backend if available
            const msg = err.response?.data?.message || err.message || 'Error desconocido';
            setFeedbackModal({
                isOpen: true,
                title: 'Error al Regenerar',
                message: matchdays.find(m => m.id == selectedMatchday)?.matches?.some(m => m.status === 'FINAL') ? 'No se puede regenerar porque ya hay partidos jugados.' : 'Hubo un problema al regenerar. Verifica la consola.',
                type: 'error'
            });
            setIsRegenerateModalOpen(false);
        } finally {
            setLoading(false);
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
                            {(Array.isArray(matchdays) ? matchdays : []).map(m => (
                                <option key={m.id} value={m.id}>{m.label || `Jornada ${m.number}`}</option>
                            ))}
                        </select>
                    </div>

                    {/* Availability Button */}
                    <button
                        onClick={() => {
                            if (matchdays.length === 0) {
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Jornada Requerida',
                                    message: 'Primero debes crear una JORNADA para poder gestionar sus horarios.',
                                    type: 'warning'
                                });
                                return;
                            }
                            setIsAvailabilityModalOpen(true);
                        }}
                        className={`w-full md:w-auto bg-[#0f172a] hover:bg-[#1e293b] text-blue-300 font-bold py-2 px-4 rounded-xl border border-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap ${matchdays.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Clock size={18} />
                        <span>Horarios</span>
                    </button>

                    {/* Auto-Generate Button */}
                    {/* Auto-Generate Button */}
                    <button
                        onClick={async () => {
                            // 1. Basic Validations
                            if (matchdays.length === 0) {
                                setFeedbackModal({ isOpen: true, title: 'Jornada Requerida', message: 'Primero debes crear una JORNADA para poder generar partidos.', type: 'warning' });
                                return;
                            }
                            // 2. Eligibility
                            const eligibleTeams = teams.filter(t => t.isActive && !t.isBanned);
                            if (eligibleTeams.length < 2) {
                                setFeedbackModal({ isOpen: true, title: 'Equipos Insuficientes', message: 'Necesitas registrar al menos 2 EQUIPOS (y que estén activos) para usar el generador.', type: 'warning' });
                                return;
                            }

                            // Lock Logic: Strict
                            const isRegenerationLocked = matches.some(m => m.status !== 'SCHEDULED' || m.homeScore > 0 || m.awayScore > 0);

                            // 2.5 Logistics Check (Only if Generating Fresh, not Regenerating which ignores slots mostly or re-checks)
                            // Logic: If odd, (N-1)/2. If even, N/2. Both are floor(N/2).
                            const requiredMatches = Math.floor(eligibleTeams.length / 2);
                            const availableSlots = availabilityList.length;

                            if (matches.length === 0 && availableSlots < requiredMatches) {
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Faltan Horarios',
                                    message: `Logística Insuficiente.\n\nEquipos Activos: ${eligibleTeams.length}\nPartidos Necesarios: ${requiredMatches}\nHorarios Disponibles: ${availableSlots}\n\nPor favor configura más horarios antes de generar.`,
                                    type: 'warning'
                                });
                                return;
                            }

                            if (!selectedMatchday) return;

                            // 3. REGENERATE FLOW
                            if (matches.length > 0) {
                                if (isRegenerationLocked) {
                                    setFeedbackModal({
                                        isOpen: true,
                                        title: 'Sorteo Bloqueado',
                                        message: 'No puedes regenerar esta jornada porque ya tiene partidos iniciados, jugados o con goles registrados. \n\nPara volver a sortear, debes reiniciar manualmente los partidos a estado PENDIENTE y sin goles.',
                                        type: 'error'
                                    });
                                    return;
                                }

                                setIsRegenerateModalOpen(true);
                                return;
                            }

                            // 4. GENERATE FLOW (Fresh)
                            try {
                                const response = await client.post(`/matchdays/${selectedMatchday}/generate`);
                                if (response.data.length === 0) {
                                    setFeedbackModal({
                                        isOpen: true,
                                        title: 'Sin Partidos',
                                        message: 'No se generaron partidos. Verifica que haya equipos disponibles, horarios suficientes y que no se repitan encuentros (según la configuración Ida/Vuelta).',
                                        type: 'warning'
                                    });
                                } else {
                                    setMatches([...matches, ...response.data]);
                                    setFeedbackModal({
                                        isOpen: true,
                                        title: '¡Generación Exitosa!',
                                        message: `Se han generado ${response.data.length} partidos automáticamente.`,
                                        type: 'success'
                                    });
                                }
                            } catch (err) {
                                console.error("Error generating matches:", err);
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Error de Generación',
                                    message: 'Hubo un problema. Asegurate de tener horarios (canchas) disponibles en esta jornada.',
                                    type: 'error'
                                });
                            }
                        }}
                        className={`w-full md:w-auto text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap 
                            ${matches.length > 0
                                ? (matches.some(m => m.status !== 'SCHEDULED' || m.homeScore > 0 || m.awayScore > 0) ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500')
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'} 
                            ${(matchdays.length === 0 || teams.length < 2) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={matches.length > 0 ? "Regenerar sorteo" : "Generar partidos"}
                    >
                        {matches.length > 0 && matches.some(m => m.status !== 'SCHEDULED' || m.homeScore > 0 || m.awayScore > 0) ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div><span>Bloqueado</span></div> : <><Dices size={18} /><span className="hidden md:inline">{matches.length > 0 ? `Regenerar Sorteo (${matches.length})` : `Generar (${matches.length})`}</span></>}
                    </button>

                    {/* Add Match Button */}
                    <button
                        onClick={() => {
                            if (matchdays.length === 0) {
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Jornada Requerida',
                                    message: 'Primero debes crear una JORNADA para poder agregar partidos.',
                                    type: 'warning'
                                });
                                return;
                            }
                            if (teams.length < 2) {
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Equipos Insuficientes',
                                    message: 'Necesitas registrar al menos 2 EQUIPOS (y que estén activos) para crear un partido.',
                                    type: 'warning'
                                });
                                return;
                            }

                            // STRICT Validation: Check available slots
                            if (matches.length >= availabilityList.length) {
                                setFeedbackModal({
                                    isOpen: true,
                                    title: 'Sin Horarios Disponibles',
                                    message: `No se puede agregar un partido extra.\n\nTienes ${matches.length} partidos y solo ${availabilityList.length} horarios configurados.\n\nAgrega un nuevo HORARIO primero.`,
                                    type: 'warning' // or 'error' if you want red
                                });
                                return;
                            }

                            handleOpenModal();
                        }}
                        className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap ${matchdays.length === 0 || teams.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Manual</span>
                    </button>
                </div>
            </div>



            {/* Regenerate Confirmation Modal */}
            {
                isRegenerateModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsRegenerateModalOpen(false)}></div>
                        <div className="relative bg-[#0f172a] border border-amber-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                                <Dices className="text-amber-500" size={32} />
                            </div>
                            <h2 className="text-xl font-black text-white mb-2">¿Regenerar Sorteo?</h2>
                            <div className="text-gray-300 text-sm mb-6 text-left bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                                <p className="font-bold text-white">⚠️ Atención:</p>
                                <p>• Se <span className="text-red-400 font-bold">ELIMINARÁN</span> todos los partidos actuales de esta jornada.</p>
                                <p>• Se crearán nuevos cruces aleatorios.</p>
                                <p className="text-xs text-gray-500 italic">* Partidos pospuestos volverán a la bolsa de repesca.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsRegenerateModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm">Cancelar</button>
                                <button onClick={handleConfirmRegenerate} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-900/30 transition-all active:scale-95">
                                    Sí, ¡Tirar Dados! 🎲
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {sortedMatches.length === 0 ? (
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 text-center">
                        <Swords className="text-gray-600 mx-auto mb-3" size={48} />
                        <p className="text-gray-400">No hay partidos programados para esta jornada.</p>
                    </div>
                ) : (
                    sortedMatches.map(match => (
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
                                        <span className="text-xs md:text-sm font-bold text-white text-center leading-tight truncate w-full block" title={getTeamName(match.homeTeam.id)}>
                                            {getTeamName(match.homeTeam.id)}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-black text-blue-500/50">VS</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 w-24">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10">
                                            <Shield size={20} className="text-gray-500" />
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-white text-center leading-tight truncate w-full block" title={getTeamName(match.awayTeam.id)}>
                                            {getTeamName(match.awayTeam.id)}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="w-full md:w-auto flex flex-wrap md:flex-col items-center md:items-end justify-center gap-2 md:gap-1 text-xs md:text-sm text-gray-400 mt-4 md:mt-0">
                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-[10px] uppercase tracking-wider
                                        ${match.status === 'IN_PROGRESS' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' :
                                            match.status === 'FINAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                match.status === 'POSTPONED' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                    'bg-blue-500/10 text-blue-300 border-blue-500/20'}`}>
                                        {match.status === 'IN_PROGRESS' ? '● En Vivo' :
                                            match.status === 'FINAL' ? 'Finalizado' :
                                                match.status === 'POSTPONED' ? 'Pospuesto' :
                                                    match.status === 'CANCELLED' ? 'Cancelado' :
                                                        'Programado'}
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                        <Calendar size={12} className="text-blue-400" />
                                        <span>{match.date || (match.status === 'SCHEDULED' ? 'Fecha Pendiente' : 'Sin Fecha')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                        <Clock size={12} className="text-blue-400" />
                                        <span>{match.scheduledTime ? match.scheduledTime.substring(0, 5) : '--:--'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                        <MapPin size={12} className="text-emerald-400" />
                                        <span className="truncate max-w-[100px] md:max-w-none">{match.venue || 'Por definir'}</span>
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

            {/* Resting Teams (Bye) Section */}
            {(() => {
                // Calculate resting teams
                if (!matches || !teams) return null;

                // Get all IDs of teams playing in this matchday
                const playingTeamIds = new Set();
                matches.forEach(m => {
                    if (m.homeTeam) playingTeamIds.add(m.homeTeam.id);
                    if (m.awayTeam) playingTeamIds.add(m.awayTeam.id);
                });

                // Filter teams that are ACTIVE but NOT playing
                const restingTeams = teams.filter(t =>
                    t.isActive &&
                    !t.isBanned &&
                    !playingTeamIds.has(t.id)
                );

                if (restingTeams.length === 0) return null;

                return (
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="flex items-center gap-3 mb-4 opacity-70">
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Equipos en Descanso (Bye)</span>
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {restingTeams.map(team => (
                                <div key={team.id} className="bg-[#0f172a]/60 border border-white/5 rounded-xl p-4 flex items-center gap-3 opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                                        <Shield size={16} className="text-gray-500" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-300 truncate" title={team.name}>
                                        {team.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Create/Edit Modal */}
            {
                isModalOpen && (
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
                                            {teams.map(t => {
                                                // Check if team plays as Local or Visitor in ANY other match of this matchday
                                                const existingMatch = matches.find(m =>
                                                    m.id !== editingMatch?.id && // Ignore current match if editing
                                                    (m?.homeTeam?.id === t.id || m?.awayTeam?.id === t.id)
                                                );

                                                // Format warning string
                                                let warning = "";
                                                if (existingMatch) {
                                                    const isHome = existingMatch?.homeTeam?.id === t.id;
                                                    const rival = isHome ? existingMatch?.awayTeam?.name : existingMatch?.homeTeam?.name;
                                                    warning = ` ⚠️ vs ${rival.substring(0, 10)}`;
                                                }

                                                // Permission info simplified
                                                const permInfo = `P: ${t.permissionsUsed || 0}/2`;
                                                const isLimit = (t.permissionsUsed || 0) >= 2;

                                                return (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                        disabled={!!existingMatch}
                                                        className={existingMatch ? "text-red-400" : (isLimit ? "text-amber-300" : "")}
                                                    >
                                                        {t.name.substring(0, 15)} [{permInfo}{isLimit ? '!' : ''}]{warning}
                                                    </option>
                                                );
                                            })}
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
                                            {teams.map(t => {
                                                // Check if team plays as Local or Visitor in ANY other match
                                                const existingMatch = matches.find(m =>
                                                    m.id !== editingMatch?.id &&
                                                    (m?.homeTeam?.id === t.id || m?.awayTeam?.id === t.id)
                                                );

                                                let warning = "";
                                                if (existingMatch) {
                                                    const isHome = existingMatch?.homeTeam?.id === t.id;
                                                    const rival = isHome ? existingMatch?.awayTeam?.name : existingMatch?.homeTeam?.name;
                                                    // Shortened warning for mobile
                                                    warning = ` ⚠️ vs ${rival.substring(0, 10)}`;
                                                }

                                                // Shortened permission info [P: X/2]
                                                const permInfo = `P: ${t.permissionsUsed || 0}/2`;
                                                return (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                        disabled={!!existingMatch}
                                                        className={existingMatch ? "text-red-400 bg-red-900/20" : ""}
                                                    >
                                                        {t.name.substring(0, 15)} [{permInfo}]{warning}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>



                                {/* Slot Selector (Instead of Manual Date/Time/Court) */}
                                <div className="mt-4 space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">
                                        Horario de Juego Disponible
                                        <span className="ml-2 text-xs font-normal text-gray-400 normal-case">(Selecciona un espacio libre)</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                        onChange={(e) => {
                                            const slotId = e.target.value;
                                            if (!slotId) return;
                                            const slot = availabilityList.find(s => s.id == slotId);
                                            if (slot) {
                                                // Calculate Date based on DayOfWeek + MatchDay Range (Simplification: Just assume user wants the slot properties mapped)
                                                // Slot only has DayOfWeek (e.g. TUESDAY). We need a concrete Date.
                                                // Logic: Find the first date in the matchday range that matches the slot's DayOfWeek.

                                                const currentMatchDay = matchdays.find(m => m.id == selectedMatchday);
                                                let targetDate = '';

                                                if (currentMatchDay) {
                                                    const start = new Date(currentMatchDay.startDate + 'T00:00:00');
                                                    const end = new Date(currentMatchDay.endDate + 'T00:00:00');
                                                    const targetDayIndex = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].indexOf(slot.dayOfWeek);

                                                    // Find matching date
                                                    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                                                        if (d.getDay() === targetDayIndex) {
                                                            targetDate = d.toISOString().split('T')[0];
                                                            break; // Take the first matching day
                                                        }
                                                    }
                                                }

                                                setFormData({
                                                    ...formData,
                                                    date: targetDate, // Auto-calculated date
                                                    time: slot.startTime.substring(0, 5),
                                                    court: slot.fieldName,
                                                    // Optional: Store slotId if backend supports it for stronger linking
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">-- Seleccionar Horario --</option>
                                        {availabilityList
                                            .filter(slot => {
                                                // Filter logic: Show slot IF:
                                                // 1. It is NOT occupied by any match in 'matches' array
                                                // 2. OR it is occupied by THIS match (editingMatch)

                                                // Check for strict overlap
                                                const isOccupied = matches.some(m => {
                                                    // Ignore the match currently being edited (it obviously occupies its own slot)
                                                    if (editingMatch && m.id === editingMatch.id) return false;

                                                    const timeMatch = m.scheduledTime?.substring(0, 5) === slot.startTime.substring(0, 5);
                                                    const venueMatch = m.venue === slot.fieldName;

                                                    // Date check: Does match date correspond to slot DayOfWeek?
                                                    if (!m.date) return false;
                                                    // Quick check without date object creation overhead if possible, but JS Date is needed for day name
                                                    const mDate = new Date(m.date + 'T00:00:00');
                                                    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                                                    const dayName = days[mDate.getDay()];

                                                    return timeMatch && venueMatch && (dayName === slot.dayOfWeek);
                                                });

                                                // Exception: If this slot "looks like" the one belonging to the current match, show it selected.
                                                // Actually, if we are editing, we just want to see it in the list so we can keep it.
                                                // The 'isOccupied' filter above ALREADY handles ignoring self-collision.
                                                // So we just return !isOccupied.

                                                return !isOccupied;
                                            })
                                            .sort((a, b) => {
                                                // Sort by DayOfWeek index then Time
                                                const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                                                const dayDiff = days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                                                if (dayDiff !== 0) return dayDiff;
                                                return a.startTime.localeCompare(b.startTime);
                                            })
                                            .map(slot => (
                                                <option key={slot.id} value={slot.id}>
                                                    {slot.dayOfWeek} • {slot.startTime.substring(0, 5)} • {slot.fieldName}
                                                </option>
                                            ))}
                                    </select>

                                    {/* Read-only Display of Selected Values */}
                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 bg-black/20 p-2 rounded-lg border border-white/5 mt-2">
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] text-gray-500">Fecha</span>
                                            <span className="font-mono text-white">{formData.date || '--'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] text-gray-500">Hora</span>
                                            <span className="font-mono text-white">{formData.time || '--'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase text-[10px] text-gray-500">Cancha</span>
                                            <span className="font-mono text-white truncate">{formData.court || '--'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Alert */}
                                {error && (
                                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                        <AlertCircle className="text-red-400 shrink-0" size={20} />
                                        <p className="text-red-300 text-sm font-medium">{error}</p>
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
                )
            }

            {/* Availability Modal */}
            {
                isAvailabilityModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAvailabilityModalOpen(false)}></div>
                        <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Configurar Disponibilidad</h2>
                                    <p className="text-sm text-blue-200/60">Define los horarios y canchas disponibles para esta jornada.</p>
                                </div>
                                <button onClick={() => setIsAvailabilityModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Add New Slot Form */}
                            <form onSubmit={handleAddSlot} className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                                <div className="col-span-1 md:col-span-1">
                                    <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-1">Día</label>
                                    <select
                                        value={newSlot.dayOfWeek}
                                        onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                    >
                                        {/* Dynamic Options based on MatchDay Date Range */}
                                        {(() => {
                                            const currentMatchDay = matchdays.find(m => m.id == selectedMatchday);
                                            if (!currentMatchDay || !currentMatchDay.startDate || !currentMatchDay.endDate) {
                                                return <option value="">Sin Fecha</option>;
                                            }

                                            const start = new Date(currentMatchDay.startDate + 'T00:00:00'); // Valid Date parsing
                                            const end = new Date(currentMatchDay.endDate + 'T00:00:00');
                                            const options = [];

                                            // Loop through dates
                                            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                                                const dayValue = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                                                const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric' });
                                                // Capitalize first letter
                                                const formattedLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

                                                options.push(
                                                    <option key={dayValue + d.toISOString()} value={dayValue}>
                                                        {formattedLabel}
                                                    </option>
                                                );
                                            }
                                            return options.length > 0 ? options : <option value="">Rango inválido</option>;
                                        })()}
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-1">Inicio</label>
                                    <input
                                        type="time"
                                        required
                                        value={newSlot.startTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-1">Fin</label>
                                    <input
                                        type="time"
                                        required
                                        value={newSlot.endTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-1">Cancha</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Campo 1"
                                        required
                                        value={newSlot.fieldName}
                                        onChange={(e) => setNewSlot({ ...newSlot, fieldName: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
                                    />
                                </div>
                                <button type="submit" className="col-span-2 md:col-span-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center">
                                    <Plus size={18} />
                                </button>
                            </form>

                            {/* List of Slots */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                {availabilityList.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 italic">No hay horarios configurados.</div>
                                ) : (
                                    availabilityList.map((slot) => (
                                        <div key={slot.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">{slot.dayOfWeek}</div>
                                                    <div className="text-gray-400 text-xs flex items-center gap-2">
                                                        <span>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                        <span>{slot.fieldName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteSlot(slot.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                isDeleteModalOpen && (
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
                )
            }

            {/* Feedback Modal */}
            {
                feedbackModal.isOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}></div>
                        <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${feedbackModal.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                {feedbackModal.type === 'warning' ? <AlertTriangle className="text-amber-500" size={32} /> : <AlertCircle className="text-red-500" size={32} />}
                            </div>
                            <h2 className="text-xl font-black text-white mb-2">{feedbackModal.title}</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {feedbackModal.message}
                            </p>
                            <button
                                onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all active:scale-95"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminMatches;
