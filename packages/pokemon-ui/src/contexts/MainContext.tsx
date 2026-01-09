import React, { createContext, useContext, useState, ReactNode } from 'react';

type MainContextType = {
  selectedPokemon?: string;
  selectedPortfolio?: string;
  setSelectedPokemon: (name: string) => void;
  setSelectedPortfolio: (id: string) => void;
  isProfilesOpen: boolean;
  toggleProfiles: () => void;
  isPokemonsOpen: boolean;
  togglePokemons: () => void;
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

  const toggleProfiles = () => setIsProfilesOpen((prev) => !prev);
  const togglePokemons = () => setIsPokemonsOpen((prev) => !prev);

  const value: MainContextType = {
    // domain
    selectedPokemon,
    selectedPortfolio,
    setSelectedPokemon,
    setSelectedPortfolio,
    // UI
    isProfilesOpen,
    isPokemonsOpen,
    toggleProfiles,
    togglePokemons,
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