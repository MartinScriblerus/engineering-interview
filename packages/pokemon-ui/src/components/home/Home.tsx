import styled from '@emotion/styled';
import { Container, Section, Panel, Typography, Grid } from 'ui';
// import { theme } from '../../theme'

import React from 'react';
import { ProfileSelection } from '../profile-selection/ProfileSelection';

const WelcomeText = styled(Typography)`
    left: -0.25rem;
    // position: absolute;
    top: 0;
`;

const WelcomeSection = styled(Section)`
  background: ${({ theme }) => theme.colors?.surface ?? 'transparent'};
  width: 100%;
  display: flex;
  padding: ${({ theme }) => theme.space?.[3] ?? '1rem'};
`;

const WelcomeContainer = styled(Container)`
  max-width: ${({ theme }) => theme.sizes?.container ?? '100%'};
`;

const WelcomeTextPanel = styled(Panel)`
  // background-color: ${({ theme }) => theme.colors?.textMuted ?? '#666'};
  min-height: 4rem;
`;

export const Home = () => {
  return (
    <WelcomeContainer>
      <WelcomeSection direction="column">
        <WelcomeTextPanel background="pokemonPrimary">
           <WelcomeText color="pokemonSecondary" variant="display">
                Pokémon Team Builder
            </WelcomeText>
        </WelcomeTextPanel>
        </WelcomeSection>
        <Grid rows="2fr" align="start" >
            <ProfileSelection />
        </Grid>  
    </WelcomeContainer>
  );
};
