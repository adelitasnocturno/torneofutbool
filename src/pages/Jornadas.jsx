import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const Jornadas = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Todas'); // Todas, Finalizadas, Pendientes

    // Mock Data for Match Days
    const matchDays = [
        { id: 1, name: 'Jornada 1', date: 'Martes 10/01/2026', status: 'Finalizada', matches: 4 },
        { id: 2, name: 'Jornada 2', date: 'Jueves 12/01/2026', status: 'Finalizada', matches: 4 },
        { id: 3, name: 'Jornada 3', date: 'Martes 17/01/2026', status: 'Finalizada', matches: 4 },
        { id: 4, name: 'Jornada 4', date: 'Jueves 19/01/2026', status: 'Finalizada', matches: 4 },
        { id: 5, name: 'Jornada 5', date: 'Martes 24/01/2026', status: 'Programada', matches: 4 },
        { id: 6, name: 'Jornada 6', date: 'Jueves 26/01/2026', status: 'Programada', matches: 4 },
    ];

    const filteredDays = matchDays.filter(day => {
        if (filter === 'Todas') return true;
        if (filter === 'Pendientes') return day.status === 'Programada';
        return day.status === filter;
    });

    return (
        <div className="w-full h-full flex flex-col gap-6 pb-24">
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
                {filteredDays.map((day) => (
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
                                    {day.name}
                                </span>
                                <span className="text-sm text-blue-200/80 font-medium">
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
                                <span className="text-xs text-gray-500 font-medium tracking-wide">
                                    {day.matches} Partidos
                                </span>
                            </div>

                            <ChevronRight className="text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jornadas;
