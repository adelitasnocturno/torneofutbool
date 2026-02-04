import React from 'react';
import Hero from '../components/Hero';
import SponsorsStrip from '../components/SponsorsStrip';
import MatchList from '../components/MatchList';
import StandingsCard from '../components/StandingsCard';
import ScorersCard from '../components/ScorersCard';

const Home = () => {
    return (
        <div className="w-full pb-20">
            {/* Hero Section - Full Width */}
            <Hero />

            {/* Sponsors Strip - Full Width (Yellow Belt) */}
            <SponsorsStrip />

            {/* Main Content Grid - Constrained Width */}
            <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">

                {/* Full Width: Matches */}
                <div className="w-full">
                    <MatchList />
                </div>

                {/* Grid: Stats & Standings (Split 50/50) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StandingsCard />
                    <ScorersCard />
                </div>
            </div>
        </div>
    );
};

export default Home;
