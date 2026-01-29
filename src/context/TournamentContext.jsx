import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
    const [tournamentId, setTournamentId] = useState(1); // Default to ID 1 for now (or fetch active tournament)
    const [matchDays, setMatchDays] = useState([]);
    const [currentMatchDayId, setCurrentMatchDayId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [tournaments, setTournaments] = useState([]); // List of all tournaments

    useEffect(() => {
        // 0. Initialize: Fetch All Tournaments and Auto-Select Latest if none selected
        const initializeTournaments = async () => {
            try {
                const res = await client.get('/tournaments');
                if (res.data && Array.isArray(res.data)) {
                    // Sort by ID DESC (Newest first)
                    const sorted = res.data.sort((a, b) => b.id - a.id);
                    setTournaments(sorted);

                    // Auto-select the latest if we don't have one, or if the current one is invalid?
                    // For now, let's only auto-select if tournamentId is strictly default (1) and we want to upgrade it,
                    // OR if we want to force the latest on first load.
                    // Given the previous fix, we just pick the first one of the sorted list.
                    if (sorted.length > 0) {
                        // Only override if we are on the default '1' which might be wrong, or empty.
                        // But to be safe and responsive, let's just default to the latest.
                        // We can check if the current tournamentId is in the list to preserve it during re-renders?
                        // Ideally, we only set it once.
                        setTournamentId(prev => {
                            // If previous ID exists in the new list, keep it. Else, take latest.
                            const exists = sorted.find(t => t.id === prev);
                            return exists ? prev : sorted[0].id;
                        });
                    }
                }
            } catch (e) {
                console.error("Error initializing tournaments", e);
            }
        };
        initializeTournaments();
    }, []);

    const fetchTournamentData = async () => {
        if (!tournamentId) return;
        setLoading(true);
        try {
            // 1. Fetch MatchDays for the tournament
            const response = await client.get(`/tournaments/${tournamentId}/matchdays`);
            const days = response.data;
            setMatchDays(Array.isArray(days) ? days : []);

            // 2. Determine "Current MatchDay"
            if (Array.isArray(days) && days.length > 0) {
                const today = new Date().toLocaleDateString('en-CA');
                // 1. Try to find the CURRENT active matchday (Today is inside range)
                let target = days.find(d =>
                    d.startDate && d.endDate &&
                    today >= d.startDate && today <= d.endDate
                );

                // 2. If not found, try to find the NEXT upcoming one (Start date is in future)
                if (!target) {
                    target = days.find(d => d.startDate && d.startDate >= today);
                }

                if (target) {
                    setCurrentMatchDayId(target.id);
                } else {
                    // 3. Fallback to the last one (history)
                    setCurrentMatchDayId(days[days.length - 1].id);
                }
            } else {
                setCurrentMatchDayId(null);
            }
        } catch (error) {
            console.error("Failed to load tournament data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournamentData();
    }, [tournamentId]);

    const value = {
        tournamentId,
        setTournamentId, // Expose setter for the Selector
        tournaments,     // Expose list for the Selector
        matchDays,
        currentMatchDayId,
        setCurrentMatchDayId,
        loading,
        refreshData: fetchTournamentData // Expose refresh method
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
