import React from 'react';
import { Star, Coffee, Award, Zap, Shield, TrendingUp, Anchor, Briefcase } from 'lucide-react';

const SponsorsStrip = () => {
    // Standard Sponsor List
    const sponsors = [
        { id: 1, name: "Patrocinador", icon: Star },
        { id: 2, name: "Marca Top", icon: Zap },
        { id: 3, name: "Tu Marca Aquí", icon: Coffee },
        { id: 4, name: "Sponsor Oficial", icon: Shield },
        { id: 5, name: "Colaborador", icon: TrendingUp },
    ];

    return (
        <div className="w-full relative z-10 mb-12">
            {/* Glass Strip with Gold Accents */}
            <div className="w-full bg-[#0f172a]/80 backdrop-blur-md border-y border-amber-500/20 shadow-2xl relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">

                        {/* Label */}
                        <div className="flex items-center gap-3 md:border-r md:border-white/10 md:pr-8">
                            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] whitespace-nowrap">
                                Patrocinadores
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent md:hidden"></div>
                        </div>

                        {/* Logos Grid */}
                        <div className="flex-1 flex flex-wrap items-center justify-center md:justify-evenly gap-x-8 gap-y-6">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="group flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 hover:-translate-y-1">
                                    {/* Logo Placeholder */}
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <sponsor.icon size={28} className="text-white relative z-10" strokeWidth={1.5} />
                                    </div>
                                    {/* Name (Hover only) */}
                                    <span className="text-[10px] text-amber-200/80 font-bold uppercase tracking-wider absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                                        {sponsor.name}
                                    </span>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponsorsStrip;
