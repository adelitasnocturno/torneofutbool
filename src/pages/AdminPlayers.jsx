import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Search,
    User,
    Pencil,
    Trash2,
    Upload,
    X,
    CheckCircle,
    AlertTriangle,
    Shirt
} from 'lucide-react';
import client from '../api/client';

const AdminPlayers = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Team ID

    // Data States
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI States
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({ name: '', nickname: '', number: '', position: 'Delantero', photo: null });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);

    const positions = ['Portero', 'Defensa', 'Medio', 'Delantero'];

    // Fetch Team and Players
    const fetchData = async () => {
        try {
            setLoading(true);
            // Parallel fetch
            const [teamRes, playersRes] = await Promise.all([
                client.get(`/teams/${id}`),
                client.get(`/teams/${id}/players`)
            ]);
            setTeam(teamRes.data);
            setPlayers(playersRes.data);
        } catch (err) {
            console.error("Error loading players data:", err);
            setError("No se pudo cargar la información del equipo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    // Filter Logic
    const filteredPlayers = players.filter(player =>
        (player.fullName || player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleOpenModal = (player = null) => {
        setError(null);
        if (player) {
            setEditingPlayer(player);
            setFormData({
                name: player.fullName,
                nickname: player.nickname || '',
                number: player.shirtNumber,
                position: player.position || 'Delantero', // If backend doesn't have position yet, default
                photo: player.photoUrl
            });
        } else {
            setEditingPlayer(null);
            setFormData({ name: '', nickname: '', number: '', position: 'Delantero', photo: null });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlayer(null);
        setFormData({ name: '', nickname: '', number: '', position: 'Delantero', photo: null });
        setError(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const payload = {
                fullName: formData.name,
                nickname: formData.nickname,
                shirtNumber: parseInt(formData.number),
                position: formData.position,
                team: { id: parseInt(id) },
                isActive: true
            };

            if (editingPlayer) {
                // Update
                const response = await client.put(`/players/${editingPlayer.id}`, payload);
                setPlayers(players.map(p => p.id === editingPlayer.id ? response.data : p));
            } else {
                // Create
                const response = await client.post('/players', payload);
                setPlayers([...players, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            console.error("Error saving player:", err);
            if (err.response && err.response.status === 409) {
                setError("Ya existe un jugador con ese número en el equipo.");
            } else {
                setError("Error al guardar el jugador.");
            }
        }
    };

    const handleDeleteClick = (player) => {
        setPlayerToDelete(player);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (playerToDelete) {
            try {
                const payload = { ...playerToDelete, isActive: false, team: { id: parseInt(id) } };
                const response = await client.put(`/players/${playerToDelete.id}`, payload);
                setPlayers(players.map(p => p.id === playerToDelete.id ? response.data : p));
                setIsDeleteModalOpen(false);
                setPlayerToDelete(null);
            } catch (err) {
                console.error("Error deactivating player:", err);
                setError("No se pudo eliminar el jugador.");
            }
        }
    };

    const handleReactive = async (player) => {
        try {
            const payload = { ...player, isActive: true, team: { id: parseInt(id) } };
            const response = await client.put(`/players/${player.id}`, payload);
            setPlayers(players.map(p => p.id === player.id ? response.data : p));
        } catch (err) {
            console.error("Error activating player:", err);
        }
    };

    return (
        <div className="min-h-screen w-full p-4 pb-20 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/admin/equipos')}
                        className="bg-[#0f172a]/80 hover:bg-[#1e293b] p-2.5 rounded-full border border-white/20 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group"
                    >
                        <ChevronLeft className="text-white group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-none">Plantilla: {team ? team.name : 'Cargando...'}</h1>
                        <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Gestión de Jugadores</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar jugador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Nuevo Jugador</span>
                    </button>
                </div>
            </div>

            {/* Players Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map(player => (
                    <div
                        key={player.id}
                        className={`group relative bg-[#0f172a]/80 backdrop-blur-xl border ${player.isActive ? 'border-white/10' : 'border-red-500/20'} rounded-2xl p-6 shadow-lg transition-all hover:scale-[1.01] overflow-hidden`}
                    >
                        {/* Number Badge */}
                        <div className="absolute top-0 left-0 bg-white/5 px-4 py-2 rounded-br-2xl border-r border-b border-white/5 font-black text-xl text-white/50 group-hover:text-blue-400 transition-colors">
                            {player.shirtNumber}
                        </div>

                        {/* Status Dot */}
                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${player.isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`}></div>

                        <div className="flex flex-col items-center text-center mt-2">
                            {/* Photo Placeholder */}
                            <div className="w-24 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-lg mb-4 group-hover:scale-105 transition-transform overflow-hidden relative">
                                {player.photoUrl ? (
                                    <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="text-gray-500" size={40} />
                                )}
                            </div>

                            <h3 className={`text-xl font-bold ${player.isActive ? 'text-white' : 'text-gray-500 line-through decoration-red-500/50'}`}>
                                {player.fullName}
                            </h3>
                            <span className="text-sm text-blue-300 font-medium uppercase tracking-wider mt-1 bg-blue-500/10 px-3 py-0.5 rounded-full border border-blue-500/10">
                                {player.position || 'Jugador'}
                            </span>

                            {/* Actions Divider */}
                            <div className="w-full h-px bg-white/5 my-5"></div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2 w-full">
                                <button
                                    onClick={() => handleOpenModal(player)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 py-2 rounded-lg border border-blue-500/10 transition-colors text-sm font-semibold"
                                >
                                    <Pencil size={16} />
                                </button>
                                {player.isActive ? (
                                    <button
                                        onClick={() => handleDeleteClick(player)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 py-2 rounded-lg border border-red-500/10 transition-colors text-sm font-semibold"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReactive(player)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 py-2 rounded-lg border border-emerald-500/10 transition-colors text-sm font-semibold"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Ej. Carlos Ruiz"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Dorsal</label>
                                    <div className="relative">
                                        <Shirt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="number"
                                            required
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="#"
                                        />
                                    </div>
                                </div>

                                {/* Position */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Posición</label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Fotografía</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="text-blue-400" size={18} />
                                    </div>
                                    <p className="text-xs text-gray-400">Subir foto (Opcional)</p>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                {editingPlayer ? 'Guardar Cambios' : 'Registrar Jugador'}
                            </button>
                        </form>

                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-[#0f172a] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">¿Dar de baja?</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            El jugador <span className="text-white font-bold">"{playerToDelete?.name}"</span> pasará a estado inactivo.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all active:scale-95">Sí, desactivar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlayers;
