import React, { useEffect, useMemo, useState } from 'react';
import { Panel, Header, Typography, Stack, Button, Grid } from 'ui';
import { useMainContext } from '../../contexts/MainContext';
import { getProfiles, getAllTeams, createTeam } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import { PokemonSelector } from './PokemonSelector';
import styled from '@emotion/styled';

/**
 * Small cross SVG icon — keeps visuals crisp and independent of font-size.
 */
const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" role="img">
    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StyledCloseButton = styled(Button)`
  /* Compact square hit area */
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Make sure text won't leak (we use an SVG child instead) */
  font-size: 0;
  line-height: 0;

  border-radius: 4px;
  background: transparent;
  color: inherit;
  border: none;

  &:hover {
    background: rgba(0,0,0,0.06);
  }
  &:active {
    background: rgba(0,0,0,0.10);
  }
  &:focus {
    outline: 2px solid rgba(0,0,0,0.12);
    outline-offset: 2px;
  }

  & > svg {
    width: 12px;
    height: 12px;
    display: block;
  }
`;

const StyledCloseRow = styled(Stack)`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4px;
`;

export const TeamEditor: React.FC<{ onCreated?: (team: any) => void }> = ({ onCreated }) => {
  const { selectedPortfolio, setSelectedPortfolio, addTeam, setTeams, teams } = useMainContext();
  const location = useLocation();
  const state = (location.state ?? {}) as any;
  const profileIdFromState: string | undefined = state?.selectedProfileId;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [teamName, setTeamName] = useState('');
  const [pokemonIds, setPokemonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    const res = await getProfiles();
    setProfiles(res.data ?? []);
  };

  const fetchTeamsIntoContext = async () => {
    const res = await getAllTeams();
    setTeams(res.data ?? []);
  };

  useEffect(() => {
    fetchProfiles();
    fetchTeamsIntoContext();
  }, []);

  // determine initial profileId: prefer router state, else try context (match name -> id), else keep undefined
  useEffect(() => {
    if (profileIdFromState) {
      setProfileId(profileIdFromState);
      return;
    }
    if (selectedPortfolio) {
      // selectedPortfolio might be an id or a name depending on how tryGetTeamsSelection is used
      // try to match by id first
      const byId = profiles.find((p) => p.id === selectedPortfolio);
      if (byId) {
        setProfileId(byId.id);
        return;
      }
      // otherwise try match by name
      const byName = profiles.find((p) => p.name === selectedPortfolio);
      if (byName) {
        setProfileId(byName.id);
        return;
      }
    }
  }, [profileIdFromState, selectedPortfolio, profiles]);

  const handleCreate = async () => {
    // prefer local profileId, fall back to router state or context
    const effectiveProfileId = profileId ?? profileIdFromState ?? selectedPortfolio;

    if (!teamName.trim() || !effectiveProfileId) {
      // replace with toast in prod
      console.warn('Team name and profile are required.', { teamName, profileId, profileIdFromState, selectedPortfolio });
      return;
    }

    // Prevent duplicate team names for the same profile (case-insensitive, trimmed)
    const normalizedNewName = teamName.trim().toLowerCase();
    const duplicate = (teams ?? []).some((t: any) => {
      const existingName = String(t?.name ?? '').trim().toLowerCase();
      const existingProfileId = t?.profile?.id ?? t?.profile ?? null;
      return existingName === normalizedNewName && String(existingProfileId) === String(effectiveProfileId);
    });
    if (duplicate) {
      setError('A team with this name already exists for the selected profile.');
      return;
    }

    setLoading(true);
    try {
      console.log('%c[CreateTeam Payload]', 'color: orange; font-weight: 700;', { name: teamName, profileId: effectiveProfileId, pokemonIds });
      try {
        const res = await createTeam({ name: teamName, profileId: effectiveProfileId, pokemonIds });
        const created = res.data;

        // Update global UI state without triggering refetches or automatic selection side-effects
        addTeam(created);

        // set the profile as selected in the UI
        setSelectedPortfolio(effectiveProfileId);

        // clear local form state
        setTeamName('');
        setPokemonIds([]);
        setError(null);
        onCreated?.(created);

        console.log('%c[Team Created] Ready to act on team:', 'color: royalblue; font-weight: 700;', created);
      } catch (err: any) {
        console.error('create team failed', err);
        setError(err?.response?.data?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error('create team failed', err);
      setLoading(false);
    }
  };

  const profileOptions = useMemo(() => profiles, [profiles]);

  return (
    <Panel background="surface" rounded={false}>
      <Stack direction="row">
        <Header sticky="sticky" position="top" background="surface">
          <Typography as="h2" weight="bold" uppercase color="accent">
            Name your Team!
          </Typography>
        </Header>

        <Panel background="bgHero">
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </Panel>
        {error && (
          <Panel background="pokemonTertiary" color="#f6f6f6">
              <StyledCloseRow direction="row">
                <StyledCloseButton aria-label="Dismiss error" onClick={() => setError(null)}>
                  <CrossIcon />
                </StyledCloseButton>
              </StyledCloseRow>
            <Typography as="div" color="danger">
              {error}
            </Typography>
          </Panel>
        )}
      </Stack>

      <Stack direction="column" spacing="8px">
        <PokemonSelector selected={pokemonIds} onChange={setPokemonIds} />

        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8 }}>
          <Button onClick={handleCreate} disabled={loading}>
            Create Team
          </Button>
          <Button
            onClick={() => {
              setTeamName('');
              setPokemonIds([]);
            }}
            type="button"
          >
            Clear
          </Button>
        </div>
      </Stack>
    </Panel>
  );
};