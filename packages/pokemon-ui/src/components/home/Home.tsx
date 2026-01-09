import styled from '@emotion/styled';
import { Container, Section, Panel, Typography } from 'ui';

import React from 'react';

export const Home = () => {
    return (
        <Container>
            <Section> 
                <Panel>
                    <Typography>
                        Welcome pokemon-ui
                    </Typography>
                </Panel>
            </Section>
        </Container>
    )
};