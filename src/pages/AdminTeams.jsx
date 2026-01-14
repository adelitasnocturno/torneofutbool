import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Plus,
    Search,
    Shield,
    Pencil,
    Trash2,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Users
} from 'lucide-react';

const AdminTeams = () => {
    const navigate = useNavigate();

    // Mock Initial Data
    const [teams, setTeams] = useState([
        { id: 1, name: 'Tigres', active: true, logo: null },
        { id: 2, name: 'Atlético', active: true, logo: null },
        { id: 3, name: 'Dragones', active: true, logo: null },
        { id: 4, name: 'Deportivo', active: true, logo: null },
        { id: 5, name: 'Estrella', active: true, logo: null },
        { id: 6, name: 'Lobos FC', active: true, logo: null },
    ]);

    // UI States
    const [searchTerm, setSearchTerm] = useState('');

    // Create/Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({ name: '', logo: null });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);

    // Filter Logic
    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleOpenModal = (team = null) => {
        if (team) {
            setEditingTeam(team);
            setFormData({ name: team.name, logo: team.logo });
        } else {
            setEditingTeam(null);
            setFormData({ name: '', logo: null });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
        setFormData({ name: '', logo: null });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingTeam) {
            // Edit
            setTeams(teams.map(t => t.id === editingTeam.id ? { ...t, ...formData } : t));
        } else {
            // Create
            const newTeam = {
                id: Date.now(), // Simple ID generation
                name: formData.name,
                logo: formData.logo,
                active: true
            };
            setTeams([...teams, newTeam]);
        }
        handleCloseModal();
    };

    // Trigger Delete Modal
    const handleDeleteClick = (team) => {
        setTeamToDelete(team);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete Action
    const confirmDelete = () => {
        if (teamToDelete) {
            setTeams(teams.map(t => t.id === teamToDelete.id ? { ...t, active: false } : t));
            setIsDeleteModalOpen(false);
            setTeamToDelete(null);
        }
    };

    const handleReactive = (id) => {
        setTeams(teams.map(t => t.id === id ? { ...t, active: true } : t));
    };

    // File Input Handler (Mock)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file);
        }
    };

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
                        <h1 className="text-2xl font-black text-white leading-none">Gestión de Equipos</h1>
                        <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Administración</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar equipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Nuevo Equipo</span>
                    </button>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map(team => (
                    <div
                        key={team.id}
                        className={`group relative bg-[#0f172a]/80 backdrop-blur-xl border ${team.active ? 'border-white/10' : 'border-red-500/20'} rounded-2xl p-6 shadow-lg transition-all hover:scale-[1.01]`}
                    >
                        {/* Status Indicator */}
                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${team.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`}></div>

                        <div className="flex flex-col items-center text-center">
                            {/* Logo Placeholder */}
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-2 border-white/10 mb-4 shadow-inner group-hover:shadow-blue-500/20 transition-shadow">
                                <Shield className="text-gray-500" size={32} />
                            </div>

                            <h3 className={`text-lg font-bold ${team.active ? 'text-white' : 'text-gray-500 line-through decoration-red-500/50'}`}>
                                {team.name}
                            </h3>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                                {team.active ? 'Activo' : 'Inactivo'}
                            </span>

                            {/* Actions Divider */}
                            <div className="w-full h-px bg-white/5 my-4"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full">
                                <button
                                    onClick={() => navigate(`/admin/equipos/${team.id}/jugadores`)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-1.5 rounded-lg border border-indigo-500/10 transition-colors text-sm font-semibold"
                                >
                                    <Users size={14} /> Plantilla
                                </button>
                                <button
                                    onClick={() => handleOpenModal(team)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 py-1.5 rounded-lg border border-blue-500/10 transition-colors text-sm font-semibold"
                                >
                                    <Pencil size={14} /> Editar
                                </button>
                                {team.active ? (
                                    <button
                                        onClick={() => handleDeleteClick(team)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 py-1.5 rounded-lg border border-red-500/10 transition-colors text-sm font-semibold"
                                    >
                                        <Trash2 size={14} /> Baja
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReactive(team.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 py-1.5 rounded-lg border border-emerald-500/10 transition-colors text-sm font-semibold"
                                    >
                                        <CheckCircle size={14} /> Activar
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
                                {editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Nombre del Equipo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Ej. Real Madrid"
                                />
                            </div>

                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Logo (Escudo)</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="text-blue-400" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium">Click para subir imagen</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 2MB)</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                {editingTeam ? 'Guardar Cambios' : 'Crear Equipo'}
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
                            El equipo <span className="text-white font-bold">"{teamToDelete?.name}"</span> pasará a estado inactivo y no aparecerá en las listas públicas.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all active:scale-95"
                            >
                                Sí, desactivar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeams;
