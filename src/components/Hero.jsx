import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            content: (
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    {/* Main Logo Display */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 animate-fade-in-up">
                        {/* Glow behind logo */}
                        <div className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full animate-pulse"></div>

                        <img
                            src={logo}
                            alt="Torneo Logo"
                            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        ¡Inscripciones Abiertas!
                    </h2>
                    <div className="w-24 h-1 bg-yellow-400 rounded-full mb-6"></div>
                    <p className="text-xl text-blue-100 font-medium max-w-lg mx-auto drop-shadow-md">
                        Forma tu equipo y compite por la gloria nocturna.
                    </p>
                    <button className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform">
                        Registrar Equipo
                    </button>
                </div>
            )
        }
    ];

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full mt-4 mb-8">
            {/* Welcome Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] tracking-wide">
                    ¡Bienvenido!
                </h2>
            </div>

            {/* Carousel Container */}
            <div className="relative group overflow-hidden border-y border-white/20 shadow-[0_0_50px_-10px_rgba(30,58,138,0.5)] bg-gradient-to-b from-[#1a2c4e]/40 to-[#0f172a]/40 backdrop-blur-sm min-h-[350px] md:min-h-[400px] flex items-center justify-center">

                {/* Background Highlight for Slider */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

                {/* Content */}
                <div className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out transform">
                    {slides[currentSlide].content}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute z-20 left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/30"
                >
                    <ChevronLeft size={36} />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute z-20 right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/30"
                >
                    <ChevronRight size={36} />
                </button>

                {/* Pagination Dots */}
                <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                                ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                                : 'bg-white/20 w-2 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
