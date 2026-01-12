import styled from '@emotion/styled';
import { Container, Section, Panel, Typography, Stack, Button, Grid } from 'ui';

import { useLocation } from 'react-router-dom';
import { useMainContext } from '../../contexts/MainContext';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllTeams, getTeamPokemonNames } from '../../utils/api';
import { TeamEditor } from '../team-creation/TeamEditor';

const Column = styled.div`
  flex: 0 0 33%;
  padding: 12px;
  box-sizing: border-box;
  min-width: 0; /* important for flex children to allow children to shrink */
`;

const CurrProfileColumn = styled(Column)`
    max-width: 200px;
`;

export const TeamSelection = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as {
    selectedProfileName?: string;
    selectedProfileId?: string;
    selectedTeamId?: string;
  };
  const profileFromState = state?.selectedProfileName;
  const profileIdFromState = state?.selectedProfileId;
  const teamIdFromState = state?.selectedTeamId;

  const { selectedPortfolio, setSelectedPortfolio } = useMainContext();

  const profileToUse = profileFromState ?? selectedPortfolio;

  // effective profile id: prefer router-state id then context
  const effectiveProfileId = profileIdFromState ?? (typeof selectedPortfolio === 'string' ? selectedPortfolio : undefined);

  const [teams, setTeams] = useState<any[]>([]);
  const [teamPokemonNames, setTeamPokemonNames] = useState<string[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    getAllTeams().then((res) => setTeams(res.data ?? []));
  }, []);

  // derive the list of teams to display for the chosen profile (or all if no profile)
  const displayedTeams = useMemo(() => {
    if (!effectiveProfileId) return teams;
    return teams.filter((t) => (t?.profile?.id ?? (t as any).profileId) === effectiveProfileId);
  }, [teams, effectiveProfileId]);

  // memoize handler so effect deps are stable
  const showSelectedTeamPokemons = useCallback(
    async (team: any) => {
      if (!team?.id) return;
      setSelectedTeamId(team.id);
      try {
        const namesRes = await getTeamPokemonNames(team.id);
        setTeamPokemonNames((namesRes.data?.pokemonNames ?? []).slice(0, 6));
      } catch (err) {
        console.warn('Could not fetch pokemon names for team', err);
      }
    },
    [] // no internal deps
  );

  // Auto-select if router provided a teamId. Wait until teams loaded so we can find the team and sync context if needed.
  useEffect(() => {
    if (!teamIdFromState) return;
    // try to find team in the loaded list; if available, prefer that object
    const teamObj = teams.find((t) => t.id === teamIdFromState);
    if (teamObj) {
      // if profile is not in context, sync it so other components see it
      const teamProfileId = teamObj?.profile?.id ?? (teamObj as any).profileId;
      if (teamProfileId && teamProfileId !== selectedPortfolio) {
        setSelectedPortfolio(teamProfileId);
      }
      showSelectedTeamPokemons(teamObj);
    } else {
      // teams not loaded yet or team not present -> call handler with minimal object (it will still fetch names)
      showSelectedTeamPokemons({ id: teamIdFromState });
    }
  }, [teams, teamIdFromState, selectedPortfolio, setSelectedPortfolio, showSelectedTeamPokemons]);

    return (
        <Container noPadding>
            <Section direction="column" gap="0px" padding="0">  
                <Panel background='pokemonPrimary' rounded={false} padding="0">
                    <Stack direction='row'>
                        {/* Column 1: Current Profile */}
                        <CurrProfileColumn>
                            <Typography as="h3" variant="body" color="pokemonTertiary" >
                                Current Profile:
                            </Typography>
                            <Typography as="h3" variant="heading" color="#f6f6f6">
                                {profileToUse}
                            </Typography>
                        </CurrProfileColumn>

                        {/* Column 2: Teams list */}
                        <Column>
                            <Typography as="h3" variant="body" color="pokemonTertiary">
                                Teams
                            </Typography>
                                <Stack background="primaryPokemon" direction="column" spacing="4px" scroll="vertical" maxHeight={100} paddingTop={4}>
                                {teams.filter(t => t.profile.id === selectedPortfolio).map(t => (
                                  <Button
                                    key={t.id}
                                    onClick={() => showSelectedTeamPokemons(t)}
                                    background={selectedTeamId === t.id ? 'accent' : 'pokemonSecondary'}
                                    type="button"
                                  >
                                    {t.name}
                                  </Button>
                                ))}
                            </Stack>
                        </Column>

                        {/* Column 3: Pokemon on selected team (grid up to 6 items) */}
                        <Column>
                            <Typography as="h3" variant="body" color="pokemonTertiary" >
                                Selected Team
                            </Typography>
                            <Grid columns="repeat(auto-fit, minmax(120px, 1fr))" gap="8px">
                                {Array.from({ length: 6 }).map((_, idx) => {
                                    const name = teamPokemonNames[idx];
                                    return name ? (
                                        <Button key={name} onClick={() => console.log('clicked pokemon', name)} type="button">
                                            {name}
                                        </Button>
                                    ) : (
                                        // placeholder empty slot for consistent surface visibility
                                        <div key={`empty-${idx}`} style={{ minHeight: 44 }} />
                                    );
                                })}
                            </Grid>
                        </Column>
                    </Stack>
                </Panel>
            </Section> 
            <TeamEditor />
        </Container>
    )
};