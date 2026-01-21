import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { useState, useEffect } from 'react';
import client from '../api/client';

const MatchItem = ({ homeTeam, awayTeam, scheduledTime, venue, status }) => {
    return (
        <div className="group relative flex items-center justify-between p-2 md:p-4 border-b border-gray-300/30 hover:bg-white/10 transition-colors last:border-0">

            {/* Team 1 (Home) */}
            <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                <div className="shrink-0 relative">
                    <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-900 fill-current opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white pt-1">
                        {homeTeam.shortName || homeTeam.name.substring(0, 3).toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-bold text-[#1a2c4e] text-xs md:text-base leading-tight break-words">
                        {homeTeam.name}
                    </span>
                    <span className="text-[9px] md:text-xs text-gray-500 font-medium leading-tight">
                        {/* Format time nicely */}
                        {scheduledTime ? scheduledTime.substring(0, 5) : 'TBD'} <span className="block md:inline text-gray-700">{venue || 'Campo 1'}</span>
                    </span>
                </div>
            </div>

            {/* VS (Center) */}
            <div className="shrink-0 px-0.5 md:px-4 flex flex-col items-center justify-center w-8 md:w-auto">
                <span className="text-lg md:text-2xl font-black text-[#1a2c4e] italic tracking-tighter drop-shadow-sm opacity-80">
                    VS
                </span>
                <div className="flex gap-0.5 md:gap-1 mt-0.5">
                    <div className={`w-0.5 h-0.5 md:w-1 md:h-1 rounded-full ${status === 'FINAL' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`w-0.5 h-0.5 md:w-1 md:h-1 rounded-full ${status === 'FINAL' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
            </div>

            {/* Team 2 (Away) */}
            <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-3 text-right min-w-0">
                <div className="flex flex-col items-end min-w-0 pl-1">
                    <span className="font-bold text-[#1a2c4e] text-xs md:text-base leading-tight break-words">
                        {awayTeam.name}
                    </span>
                    {/* Stars removed for now, maybe add record later */}
                </div>
                <div className="shrink-0 relative">
                    <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#1a2c4e] fill-current opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white pt-1">
                        {awayTeam.shortName || awayTeam.name.substring(0, 3).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="pl-1 md:pl-3 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 flex items-center">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </div>
        </div>
    );
};

const MatchList = () => {
    const navigate = useNavigate();
    const { currentMatchDayId, matchDays } = useTournament();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentMatchDayId) {
            setMatches([]);
            return;
        }

        const fetchMatches = async () => {
            setLoading(true);
            try {
                const response = await client.get(`/matchdays/${currentMatchDayId}/matches`);
                setMatches(response.data);
            } catch (error) {
                console.error("Error fetching matches:", error);
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [currentMatchDayId]);

    const currentMatchDayLabel = matchDays.find(d => d.id === currentMatchDayId)?.label || "Próximos Partidos";

    return (
        <div className="w-full">
            {/* Header Outside - Centered */}
            <div className="flex justify-center mb-2 px-1">
                <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center">
                    {currentMatchDayLabel}
                </h3>
            </div>

            <div className="backdrop-blur-md bg-white/60 border border-white/40 shadow-xl rounded-xl overflow-hidden relative">
                {/* Glass Reflection */}
                <div className="absolute inset-x-0 top-0 h-px bg-white/70"></div>

                <div className="flex flex-col divide-y divide-gray-300/50 min-h-[100px]">
                    {loading ? (
                        <div className="flex items-center justify-center p-8 text-gray-600 font-medium">
                            Cargando partidos...
                        </div>
                    ) : matches.length > 0 ? (
                        matches.map(match => (
                            <MatchItem key={match.id} {...match} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center p-8 text-gray-500 italic">
                            No hay partidos programados para esta jornada.
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                <div className="p-3 md:p-4 bg-gradient-to-b from-transparent to-white/20 flex justify-end relative z-10 glass-footer">
                    <button
                        onClick={() => navigate('/jornadas')}
                        className="bg-gradient-to-b from-[#1e3a8a] to-[#172554] hover:from-[#2563eb] hover:to-[#1e40af] text-white text-sm md:text-base font-bold py-1.5 px-6 rounded shadow-lg border border-white/20 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        Ver todas las jornadas
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchList;
