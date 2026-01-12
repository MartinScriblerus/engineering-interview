import axios from 'axios';

// // Use VITE_ prefix for env variables in Vite
// const BASE_URL = (window as any).__ENV_API_BASE || 'http://localhost:3000/api';

// Use VITE_ prefix for env variables in Vite
// Use a relative path so Vite dev server proxy handles requests in development.
const BASE_URL = (window as any).__ENV_API_BASE || '/api';

// Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request helpers (named exports)
export const getProfiles = () => api.get('/profiles');

// Fetch a single team by id
export const getTeam = (teamId: string) => api.get(`/teams/${teamId}`);

// Fetch teams list (discovery / top-N). Optional topN param
export const getAllTeams = (topN?: number) =>
  api.get('/teams', { params: topN ? { topN } : undefined });

// Get profile's teams
export const getProfileTeams = (profileId: string) =>
  api.get(`/profiles/${profileId}/teams`);

// List all Pokémon
export const getPokemon = () => api.get('/pokemon');

// Create a profile
export const createProfile = (payload: { name: string; password?: string }) =>
  api.post('/profiles', payload);

// Create a team
// payload minimally: { name: string; profileId: string; pokemonIds?: string[] }
export const createTeam = (payload: { name: string; profileId: string; pokemonIds?: string[] }) =>
  api.post('/teams', payload);

// Get human-readable pokemon names for a team
export const getTeamPokemonNames = (teamId: string) =>
  api.get(`/teams/${teamId}/pokemon-names`);