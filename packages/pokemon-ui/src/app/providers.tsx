import { ReactNode } from 'react';
import { MainProvider } from '../contexts/MainContext';

type Props = { children?: ReactNode };

export type Pokemon = {
  id: string;
  name: string;
  pokedexNumber: number;
  profileId: string;
  selectedCount: number;
}

export type Profile = {
  id: string;
  name: string;
  persistent: boolean;
  createdAt: Date;
  selectedCount: string;
}

export type Team = {
  id: string;
  name: string;
  profileId: string;
  createdAt: Date;
  selectedCount: number;
}

export type MainContextState = {
  profiles: Profile[];
  teams: Team[];
  pokemon: Pokemon[];
  loading: boolean;
  refreshProfiles(): Promise<void>;
  refreshTeams(): Promise<void>;
};

export function AppProviders({ children }: Props) {  
  return (
    <MainProvider>
        {children}
    </MainProvider>
  )
}