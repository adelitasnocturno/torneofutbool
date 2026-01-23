import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    CalendarPlus,
    Type,
    Calendar,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const AdminCreateMatchday = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();

    const [formData, setFormData] = useState({
        date: '',
        label: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        try {
            await client.post('/matchdays', {
                tournament: { id: tournamentId },
                date: formData.date,
                label: formData.label
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);

        } catch (err) {
            console.error("Error creating matchday:", err);
            // Check for specific error status if backend provides it, otherwise generic
            if (err.response && (err.response.status === 409 || err.response.status === 500)) {
                // Assuming 500/409 could indicate duplicate based on the UniqueConstraint
                // Ideally backend returns specific message, but we can infer duplicate date
                setError('Error: Es probable que ya exista una jornada en esta fecha.');
            } else {
                setError('Hubo un error al crear la jornada. Inténtalo de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="text-2xl font-black text-white leading-none">Nueva Jornada</h1>
                    <span className="text-blue-300 text-xs font-medium uppercase tracking-wider">Administración</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="max-w-xl mx-auto">
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Decorative Header */}
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <CalendarPlus className="text-blue-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Detalles de la Jornada</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Date Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-blue-200 uppercase tracking-wide flex items-center gap-2">
                                <Calendar size={14} /> Fecha
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Label Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-blue-200 uppercase tracking-wide flex items-center gap-2">
                                <Type size={14} /> Etiqueta (Nombre)
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Ej. Jornada 5 - Martes"
                            />
                            <p className="text-xs text-gray-400 pl-1">Nombre descriptivo para identificar la jornada en el calendario.</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="text-red-400 shrink-0" size={20} />
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <CheckCircle className="text-emerald-400 shrink-0" size={20} />
                                <p className="text-emerald-300 text-sm font-medium">¡Jornada creada correctamente!</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-blue-500/25"
                        >
                            <Save size={20} />
                            Crear Jornada
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateMatchday;
