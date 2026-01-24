import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Shield,
    Calendar,
    AlertTriangle,
    Save,
    Trash2,
    CheckCircle,
    Info,
    FileText
} from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const AdminPermissions = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();

    const [teams, setTeams] = useState([]);
    const [matchdays, setMatchdays] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        teamId: '',
        matchDayId: '',
        reason: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (tournamentId) {
            fetchInitialData();
            fetchPermissions();
        }
    }, [tournamentId]);

    const fetchInitialData = async () => {
        try {
            const [teamsRes, matchdaysRes] = await Promise.all([
                client.get(`/tournaments/${tournamentId}/teams`),
                client.get(`/tournaments/${tournamentId}/matchdays`)
            ]);
            setTeams(teamsRes.data);
            setMatchdays(matchdaysRes.data);
        } catch (err) {
            console.error("Error loading initial data:", err);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await client.get('/permissions'); // Global permissions endpoint
            setPermissions(response.data);
        } catch (err) {
            console.error("Error loading permissions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.teamId || !formData.matchDayId || !formData.reason.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await client.post('/permissions', {
                teamId: formData.teamId,
                matchDayId: formData.matchDayId,
                reason: formData.reason
            });
            setSuccess('Permiso registrado correctamente.');
            setFormData({ teamId: '', matchDayId: '', reason: '' });
            fetchPermissions(); // Refresh list
            fetchInitialData(); // Refresh teams to update permission counters
        } catch (err) {
            console.error("Error creating permission:", err);
            setError(err.response?.data?.error || 'Error al crear el permiso.');
        }
    };

    const [permissionToDelete, setPermissionToDelete] = useState(null);

    const handleDelete = (perm) => {
        setPermissionToDelete(perm);
    };

    const confirmDelete = async () => {
        if (!permissionToDelete) return;
        try {
            await client.delete(`/permissions/${permissionToDelete.id}`);
            fetchPermissions();
            fetchInitialData(); // Refresh teams
            setPermissionToDelete(null);
        } catch (err) {
            console.error("Error deleting permission:", err);
            alert('Error al eliminar el permiso.');
            setPermissionToDelete(null);
        }
    };

    const getTeamName = (id) => teams.find(t => t.id == id)?.name || 'Desconocido';
    const getMatchDayLabel = (id) => matchdays.find(m => m.id == id)?.label || 'Desconocido';

    return (
        <div className="min-h-screen w-full p-4 pb-20 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-[#0f172a]/80 hover:bg-[#1e293b] p-2.5 rounded-full border border-white/20 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group"
                >
                    <ChevronLeft className="text-white group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white leading-none">Gestión de Permisos</h1>
                    <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Ausencias y Justificantes</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                <FileText className="text-blue-400" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Nuevo Permiso</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Equipo</label>
                                <select
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    value={formData.teamId}
                                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                >
                                    <option value="">Seleccionar Equipo...</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.permissionsUsed || 0}/2 usados)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Jornada</label>
                                <select
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    value={formData.matchDayId}
                                    onChange={(e) => setFormData({ ...formData, matchDayId: e.target.value })}
                                >
                                    <option value="">Seleccionar Jornada...</option>
                                    {matchdays.map(m => (
                                        <option key={m.id} value={m.id}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200 uppercase tracking-wide">Motivo / Incidencia</label>
                                <textarea
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                                    placeholder="Describa la razón del permiso..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-300 text-sm">
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2 text-emerald-300 text-sm">
                                    <CheckCircle size={16} />
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                            >
                                <Save size={18} />
                                Registrar Permiso
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Info size={20} className="text-purple-400" />
                                Historial de Permisos
                            </h2>
                            <span className="text-gray-400 text-sm">{permissions.length} registros</span>
                        </div>

                        {loading ? (
                            <p className="text-center text-gray-400 py-8">Cargando...</p>
                        ) : permissions.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-400">No hay permisos registrados.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {permissions.map(perm => (
                                    <div key={perm.id} className="bg-[#1e293b]/50 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group w-full">
                                        <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                                                <Shield size={20} className="text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-bold text-lg truncate">{perm.team?.name || 'Equipo eliminado'}</h3>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-blue-300 shrink-0">
                                                        <Calendar size={12} />
                                                        {perm.matchDay?.label || 'Jornada eliminada'}
                                                    </span>
                                                    <span className="text-gray-500 text-xs shrink-0">
                                                        {new Date(perm.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-sm mt-2 italic border-l-2 border-purple-500/50 pl-3 break-words">
                                                    "{perm.reason}"
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(perm)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all self-end md:self-center"
                                            title="Revocar Permiso"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {permissionToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPermissionToDelete(null)}></div>
                    <div className="relative bg-[#0f172a] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2">¿Revocar Permiso?</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Esta acción eliminará el registro y restaurará el uso de permisos del equipo.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setPermissionToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all active:scale-95">Sí, revocar</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default AdminPermissions;
