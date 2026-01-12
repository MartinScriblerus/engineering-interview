import React, { useEffect, useMemo, useState } from 'react';
import { Panel, Header, Typography, Stack, Button, Grid } from 'ui';
import { useMainContext } from '../../contexts/MainContext';
import { getProfiles, getAllTeams, createTeam } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import { PokemonSelector } from './PokemonSelector';

export const TeamEditor: React.FC<{ onCreated?: (team: any) => void }> = ({ onCreated }) => {
  const { selectedPortfolio, setSelectedPortfolio } = useMainContext();
  const location = useLocation();
  const state = (location.state ?? {}) as any;
  const profileIdFromState: string | undefined = state?.selectedProfileId;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [teamName, setTeamName] = useState('');
  const [pokemonIds, setPokemonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    const res = await getProfiles();
    setProfiles(res.data ?? []);
  };

  const fetchTeams = async () => {
    const res = await getAllTeams();
    setTeams(res.data ?? []);
  };

  useEffect(() => {
    fetchProfiles();
    fetchTeams();
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

    setLoading(true);
    try {
        // debug log so you can see what's being sent to the server
        console.log(
        '%c[CreateTeam Payload]',
        'color: orange; font-weight: 700;',
        { name: teamName, profileId: effectiveProfileId, pokemonIds }
        );

        // use the derived, guaranteed string id
        // const res = await createTeam({ name: teamName, profileId: effectiveProfileId, pokemonIds });
        const res = await createTeam({ name: teamName, profileId: effectiveProfileId, pokemonIds });

        await fetchTeams();
        setTeamName('');
        setPokemonIds([]);
        // set the selected portfolio to the profile used
        setSelectedPortfolio(effectiveProfileId);
        onCreated?.(res.data);

        console.log('Team created', res.data);
        const created = res.data;
        onCreated?.(created);

        // fetch human-readable pokemon names for the created team
        // try {
        //     const namesRes = await getTeamPokemonNames(created.id);
        //     setTeamPokemonNames(namesRes.data?.pokemonNames ?? []);
        // } catch (err) {
        //     console.warn('Could not fetch pokemon names for team', err);
        // }
        console.log(
            '%c[Team Created] Ready to act on team:',
            'color: royalblue; font-weight: 700;',
            res?.data
        );
    } catch (err) {
        console.error('create team failed', err);
    } finally {
        setLoading(false);
    }
  };

  const profileOptions = useMemo(() => profiles, [profiles]);

  return (
    <Panel background="surface" rounded={false}>
        <Stack direction="row">
            <Header sticky="sticky" position="top" background="surface">
                <Typography as="h2" weight="bold" uppercase color="accent">
                    Create Team
                </Typography>
            </Header>

            <Panel background="bgHero">
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ width: '100%', padding: 8 }} />
            </Panel>
        </Stack>
        
        <Stack direction="column" spacing="8px">
            <PokemonSelector selected={pokemonIds} onChange={setPokemonIds} />


            <div style={{ display: 'flex', gap: 8 }}>
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
                <Button onClick={fetchTeams} type="button">
                    Refresh Teams
                </Button>
            </div>

        </Stack>

        {/* <Stack>
            <Typography color="accent">Switch Profile</Typography>

              <select
                style={{ width: '100%', padding: 8 }}
                value={profileId ?? ''}
                onChange={(e) => setProfileId(e.target.value || undefined)}
              >
                <option value="">-- select profile --</option>
                {profileOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
       
        </Stack> */}

    </Panel>
  );
};