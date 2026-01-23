import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import client from '../api/client';
import { useTournament } from '../context/TournamentContext';

const Jornadas = () => {
    const navigate = useNavigate();
    const { tournamentId } = useTournament();
    const [filter, setFilter] = useState('Todas'); // Todas, Finalizadas, Pendientes
    const [matchDays, setMatchDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchDays = async () => {
            try {
                const response = await client.get(`/tournaments/${tournamentId}/matchdays`);
                // Process data to add 'status' based on date logic or backend data
                // Assuming backend returns { id, label, date (ISO or string) }
                // We'll infer status: If date is past -> Finalizada, else Programada
                // Note: Real date comparison requires standardized date format from backend.
                // For now, let's treat all as "Programada" unless logic is added, or randomly assign for demo if needed.
                // Update: Let's assume passed dates are 'Finalizada'.

                const processedDays = response.data.map(day => {
                    // Normalize date handling using string comparison for "YYYY-MM-DD"
                    // This handles status correctly: Past = Finalizada, Today/Future = Programada
                    const today = new Date();
                    const localToday = today.toLocaleDateString('en-CA'); // Returns "YYYY-MM-DD" in local time

                    const isPast = day.date < localToday;

                    return {
                        ...day,
                        status: isPast ? 'Finalizada' : 'Programada',
                        matchesCount: 0
                    };
                });

                setMatchDays(processedDays);
            } catch (error) {
                console.error("Error fetching matchdays:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tournamentId) {
            fetchMatchDays();
        }
    }, [tournamentId]);

    const filteredDays = matchDays.filter(day => {
        if (filter === 'Todas') return true;
        if (filter === 'Pendientes') return day.status === 'Programada';
        return day.status === 'Finalizada'; // Match 'Finalizadas'
    });

    if (loading) return <div className="text-white text-center mt-10">Cargando jornadas...</div>;

    return (
        <div className="w-full h-full flex flex-col gap-6 pb-24 px-4">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pt-6">
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                    Jornadas
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-x-auto no-scrollbar">
                {['Todas', 'Finalizadas', 'Pendientes'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap
                            ${filter === tab
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Match Days List */}
            <div className="flex flex-col gap-4">
                {filteredDays.length === 0 ? (
                    <div className="text-center text-white/50 py-10">
                        No hay jornadas {filter !== 'Todas' ? filter.toLowerCase() : ''}.
                    </div>
                ) : (
                    filteredDays.map((day) => (
                        <div
                            key={day.id}
                            onClick={() => navigate(`/jornadas/${day.id}`)}
                            className="group relative w-full bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-yellow-400/50 hover:bg-[#1e293b]/90 transition-all duration-300 overflow-hidden shadow-xl"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-yellow-500/10 group-hover:to-transparent transition-all duration-500"></div>

                            {/* Left Info: Date & Name */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-inner
                                    ${day.status === 'Finalizada' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}
                                `}>
                                    <Calendar size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg leading-tight group-hover:text-yellow-400 transition-colors">
                                        {day.label}
                                    </span>
                                    <span className="text-sm text-blue-200/80 font-medium">
                                        {/* Display date nicely if possible */}
                                        {day.date}
                                    </span>
                                </div>
                            </div>

                            {/* Right Info: Status & Matches */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="flex flex-col items-end gap-1">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border
                                        ${day.status === 'Finalizada'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}
                                    `}>
                                        {day.status === 'Finalizada' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                        {day.status}
                                    </div>
                                    {/* Only show matches count if we have it, otherwise hide or fetching logic needed */}
                                    {/* <span className="text-xs text-gray-500 font-medium tracking-wide">
                                        {day.matchesCount} Partidos
                                    </span> */}
                                </div>

                                <ChevronRight className="text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Jornadas;
