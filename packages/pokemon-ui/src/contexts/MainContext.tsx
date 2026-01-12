import React, { createContext, useContext, useState, ReactNode } from 'react';

type MainContextType = {
  selectedPokemon?: string;
  selectedPortfolio?: string;
  selectedTeam?: string;
  setSelectedPokemon: (name: string) => void;
  setSelectedPortfolio: (id: string) => void;
  setSelectedTeam: (id?: string) => void;
  isProfilesOpen: boolean;
  toggleProfiles: () => void;
  isPokemonsOpen: boolean;
  togglePokemons: () => void;
  tryGetTeamsSelection: (nameOrId: string, action: string, id?: string) => void;
  teams: any[];
  setTeams: (teams: any[]) => void;
  addTeam: (team: any) => void;
};

const MainContext = createContext<MainContextType | undefined>(undefined);

type MainProviderProps = {
  children: ReactNode;
};

export const MainProvider = ({ children }: MainProviderProps) => {
  const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | undefined>();
  const [isProfilesOpen, setIsProfilesOpen] = useState<boolean>(true);
  const [isPokemonsOpen, setIsPokemonsOpen] = useState<boolean>(true);
  // inside MainProvider (add below existing state vars)
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();

  // helper to immutably prepend a created team into the global list
  const addTeam = (team: any) => {
    setTeams((prev) => {
      // avoid duplicates by id
      if (prev.some((t) => t.id === team.id)) return prev;
      return [team, ...prev];
    });
  };

  const toggleProfiles = () => setIsProfilesOpen((prev) => !prev);
  const togglePokemons = () => setIsPokemonsOpen((prev) => !prev);

  // New helper: an example implementation that stores the selected profile and opens the profiles pane.
  // You can customize this to fetch teams, navigate, or open a modal instead.
  const tryGetTeamsSelection = (nameOrId: string, action: string, id?: string) => {
    console.log('[MainContext] tryGetTeamsSelection', { nameOrId, action, id });
    // Prefer explicit id when provided
    if (id) {
      setSelectedPortfolio(id);
    } else {
      // fallback to the provided identifier (could be name or id)
      setSelectedPortfolio(nameOrId);
    }
    setIsProfilesOpen(true);
  };

  const value: MainContextType = {
    // domain
    selectedPokemon,
    selectedPortfolio,
    selectedTeam,
    setSelectedPokemon,
    setSelectedPortfolio,
    setSelectedTeam,
    // UI
    isProfilesOpen,
    isPokemonsOpen,
    toggleProfiles,
    togglePokemons,
    tryGetTeamsSelection,
    teams,
    setTeams,
    addTeam
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }
  return context;
};