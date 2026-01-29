import React from 'react';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';

const CredentialsTemplate = ({ player, teamName, tournamentName = "Torneo Nocturno" }) => {
    // Standard Card Size (approx CR80 size aspect ratio)
    // Adjusted layout for better signature space

    return (
        <div className="w-[8.5cm] h-[5.4cm] border-2 border-[#00102b] rounded-xl relative overflow-hidden bg-white text-slate-900 flex flex-col shadow-sm print:shadow-none print:border-[#00102b] page-break-inside-avoid">

            {/* Header / Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent"></div>
            </div>

            {/* Header Strip */}
            <div className="relative z-10 bg-[#00102b] text-white h-[1.3cm] flex items-center justify-between px-3 print:bg-[#00102b] print:print-color-adjust-exact">
                <div className="flex flex-col leading-tight pb-1.5">
                    <span className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold">Liga Adelitas</span>
                    <span className="text-sm font-black uppercase text-white truncate max-w-[180px]">{tournamentName}</span>
                    <span className="text-[9px] text-yellow-500 font-bold tracking-wider">TEMPORADA 2026</span>
                </div>
                <div className="h-full py-1">
                    {/* Removed brightness-0 invert to show original logo colors */}
                    <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
                </div>
            </div>

            {/* Content Body */}
            <div className="relative z-10 flex-1 flex p-2 gap-3 items-center">
                {/* Photo Area */}
                <div className="w-[2.4cm] h-[2.8cm] bg-slate-100 border border-slate-300 shrink-0 flex items-center justify-center overflow-hidden grayscale print:grayscale-0 relative shadow-sm">
                    {player.photoUrl ? (
                        <img
                            src={player.photoUrl}
                            alt={player.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="text-slate-300 w-10 h-10" />
                    )}
                </div>

                {/* Data Fields */}
                <div className="flex-1 flex flex-col gap-1 justify-center">
                    <div className="mb-0.5">
                        <span className="block text-[7px] text-slate-500 uppercase font-bold tracking-wider">Jugador</span>
                        <h2 className="text-sm font-bold uppercase leading-none line-clamp-2 text-slate-900">{player.fullName}</h2>
                    </div>

                    <div className="mb-0.5">
                        <span className="block text-[7px] text-slate-500 uppercase font-bold tracking-wider">Equipo</span>
                        <h3 className="text-xs font-semibold uppercase text-slate-800 truncate">{teamName}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                            <span className="block text-[7px] text-slate-500 uppercase font-bold tracking-wider">Dorsal</span>
                            <span className="text-sm font-bold block text-slate-900">#{player.shirtNumber}</span>
                        </div>
                        <div>
                            <span className="block text-[7px] text-slate-500 uppercase font-bold tracking-wider">Posición</span>
                            <span className="text-[9px] font-semibold block text-slate-900 uppercase">{player.position || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Signatures - INCREASED HEIGHT */}
            <div className="relative z-10 h-[1.5cm] flex items-end justify-between px-4 pb-2 gap-4">

                {/* Signature 1 */}
                <div className="flex-1 text-center">
                    <div className="border-t border-slate-400 w-full mb-1"></div>
                    <span className="text-[6px] text-slate-500 uppercase font-bold block tracking-wider">Firma del Jugador</span>
                </div>

                {/* Signature 2 */}
                <div className="flex-1 text-center">
                    <div className="border-t border-slate-400 w-full mb-1"></div>
                    <span className="text-[6px] text-slate-500 uppercase font-bold block tracking-wider">Presidente de la Liga</span>
                </div>
            </div>

        </div>
    );
};

export default CredentialsTemplate;
