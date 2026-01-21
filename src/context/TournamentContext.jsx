import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
    const [tournamentId, setTournamentId] = useState(1); // Default to ID 1 for now (or fetch active tournament)
    const [matchDays, setMatchDays] = useState([]);
    const [currentMatchDayId, setCurrentMatchDayId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournamentData = async () => {
            try {
                // 1. Fetch MatchDays for the tournament
                const response = await client.get(`/tournaments/${tournamentId}/matchdays`);
                const days = response.data;
                setMatchDays(days);

                // 2. Determine "Current MatchDay"
                // Logic: Find the first matchday that is strictly in the future, or default to the last one if all passed
                // For simplicity, let's select the last one if available, or the first one.
                // Better logic: Select the one closest to today?
                if (days.length > 0) {
                    // Auto-select the last created one tailored for "latest updates", or just the first one.
                    // Let's just default to the last one for now as it's likely the "current" one in a sequence.
                    setCurrentMatchDayId(days[days.length - 1].id);
                } else {
                    setCurrentMatchDayId(null);
                }
            } catch (error) {
                console.error("Failed to load tournament data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentData();
    }, [tournamentId]);

    const value = {
        tournamentId,
        matchDays,
        currentMatchDayId,
        setCurrentMatchDayId,
        loading
    };

    return (
        <TournamentContext.Provider value={value}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournament = () => {
    return useContext(TournamentContext);
};
