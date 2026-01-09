import styled from '@emotion/styled';
import { ReactNode } from 'react';

const StyledGrid = styled.div`
  color: pink;
`;

interface GridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creates a simple Grid wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Grid({ children, className }: GridProps) {
  return <StyledGrid className={className}>{children}</StyledGrid>;
}

export default Grid;
