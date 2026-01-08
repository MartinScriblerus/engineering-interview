import styled from '@emotion/styled';

import { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column'; // default: column
  spacing?: number | string;    // gap between items
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'; // optional alignment
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'; // optional justify
  className?: string;
}

const StyledStack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  gap: ${({ spacing }) => (spacing != null ? spacing : '8px')};
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  box-sizing: border-box;
`;


/**
 * Creates a configurable Stack wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Stack({
  children,
  direction = 'column',
  spacing = '8px',
  align,
  justify,
  className,
}: StackProps) {
  return (
    <StyledStack
      direction={direction}
      spacing={spacing}
      align={align}
      justify={justify}
      className={className}
    >
      {children}
    </StyledStack>
  );
}

export default Stack;