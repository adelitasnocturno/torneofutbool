import React from 'react';
import Hero from '../components/Hero';
import MatchList from '../components/MatchList';
import StandingsCard from '../components/StandingsCard';
import ScorersCard from '../components/ScorersCard';

const Home = () => {
    return (
        <div className="w-full pb-20">
            {/* Hero Section - Full Width */}
            <Hero />

            {/* Main Content Grid - Constrained Width */}
            <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">

                {/* Grid: Matches (Left) & Sidebar (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1: Matches (2/3 width on desktop) */}
                    <div className="lg:col-span-2">
                        <MatchList />
                    </div>

                    {/* Column 2: Sidebar Widgets (1/3 width on desktop) - Stacked */}
                    <div className="flex flex-col gap-6">
                        <StandingsCard />
                        <ScorersCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
