import styled from '@emotion/styled';
import { Container, Section, Panel, Typography, Button, Stack, Header, Form, InputFormField, FormProps } from 'ui';
import React, { useEffect, useRef, useState } from 'react';
import { createProfile, getProfiles, getAllTeams } from '../../utils/api';
import { useMainContext } from '../../contexts/MainContext';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../../app/providers';


export const ProfileSelection = () => {

    const { tryGetTeamsSelection, setSelectedPortfolio } = useMainContext();
    
    const navigate = useNavigate();
    
    const [profiles, setProfiles] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const StyledContainer = styled(Container)`
        height: 100%;
        max-height: 100%;
    `;

    useEffect(() => {
        getProfiles().then(res => setProfiles(res.data ?? []));
        getAllTeams().then(res => setTeams(res.data ?? []));
    }, []);

    const selectProfile = (profileId: string, profile: Profile) => {
        setSelectedPortfolio(profileId);
        tryGetTeamsSelection(profile.name ?? '', 'selected', profileId);
        navigate('/teams', { 
            state: { 
                selectedProfileName: profile?.name ?? '', 
                selectedProfileId: profileId,
                selectedTeamId: null, 
            }});
    };

    const validate: NonNullable<FormProps['validate']> = (values) => {
        const errors: Record<string, string | undefined> = {};
        if (!values.create_profile || String(values.create_profile).trim() === '') {
            errors.create_profile = 'Profile name is required';
        }
        return errors;
    };

    const handleSubmitValues: NonNullable<FormProps['onSubmitValues']> = async (values, evt) => {
        try {
            setLoading(true);

            const chosenName = String(values.create_profile ?? '').trim();
            if (!chosenName) {
                console.warn('Please enter a profile name');
                return;
            }

            const res = await createProfile({ name: chosenName });
            const created = res.data;
            setProfiles(prev => [created, ...prev]);
            formRef.current?.reset();

            setSelectedPortfolio(created.id);
            tryGetTeamsSelection(created.name ?? "", 'created', created.id);
            navigate('/teams', { 
                state: { 
                    selectedProfileName: created.name, 
                    selectedProfileId: created.id,
                    selectedTeamId: null, 
                }});
        } catch (err) {
            console.error('create profile failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEvent: FormProps['onSubmit'] = (evt) => {
        console.log('form submit event', evt);
    };

    return (
        <StyledContainer>
            <Section>                     
                <Panel
                    background="pokemonPrimary"
                    rounded={false}
                >
                    <Header 
                        sticky="sticky" 
                        position="top"
                        background="pokemonPrimary"
                    >
                        <Typography 
                            as="h2"
                            weight="bold"
                            uppercase 
                            color="pokemonSecondary"
                        >
                            Create Profile
                        </Typography>
                    </Header>
                    <Stack>
                        <Form
                            ref={formRef}
                            onSubmit={handleSubmitEvent}
                            onSubmitValues={handleSubmitValues}
                            validate={validate}
                            validateOn="submit"
                            preventDefault={true}
                            className="signup-form"
                            action="/legacy-endpoint"
                            method="post"
                        >
                            <InputFormField
                                name="create_profile"
                                label="Create profile"
                                placeholder="ex. Steven_Stone123"
                            />

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <Button 
                                type="submit"
                                background='heroBg'
                            >Create Profile</Button>

                            <Button
                                onClick={() => formRef.current?.reset()}
                                type="button"
                                background='pokemonTertiary'
                            >
                                Reset
                            </Button>
                            </div>
                        </Form>
                    </Stack>
                </Panel>

                <Panel
                    background="pokemonSecondary"
                    rounded={false}
                >
                    <Header 
                        sticky="sticky" 
                        position="top"
                        background="pokemonSecondary"
                    >
                        <Typography
                            as="h2"
                            weight="bold"
                            uppercase 
                            color="pokemonPrimary"
                        >
                            Select Profile
                        </Typography>
                    </Header>
                    <Stack
                        direction="column"
                        spacing="4px"
                        scroll="vertical"
                        maxHeight={154}
                        paddingTop={12}
                    >
                        {profiles.map(p => <Button 
                            key={`select_profile_${p.id}`}
                            onClick={() => selectProfile(p.id, p)}
                            background='heroBg'
                        >{p.name}</Button>)}
                    </Stack>
                </Panel>
            </Section>

            {/* Fullscreen area: All available teams as clickable buttons (layout like PokemonSelector) */}
            <Section>
                <Panel
                    background="pokemonTertiary"
                    rounded={false}
                >
                    <Stack
                        direction="column"
                    >
                        <Header sticky="sticky" position="top" background="pokemonTertiary">
                            <Typography as="h2" weight="bold" uppercase color="pokemonPrimary">
                                All Available Teams
                            </Typography>
                        </Header>

                        {/* Scrollable wrapping buttons layout, similar to PokemonSelector */}
                        <Stack background="surface" direction="column" spacing="4px" scroll="vertical" maxHeight={260} paddingTop={12}>
                          <div style={{ padding:16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {teams.map((t) => {
                              const profileName = t?.profile?.name ?? '—';
                              return (
                                <Button
                                  key={t.id}
                                  onClick={() =>
                                    navigate('/teams', {
                                      state: {
                                        selectedProfileName: profileName,
                                        selectedProfileId: t?.profile?.id ?? '',
                                        selectedTeamId: t.id,
                                      },
                                    })
                                  }
                                  background="pokemonSecondary"
                                  type="button"
                                >
                                  {t.name}
                                </Button>
                              );
                            })}
                          </div>
                        </Stack>
                    </Stack>
                </Panel>
            </Section>
        </StyledContainer>
    )
};