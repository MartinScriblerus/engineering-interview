import styled from '@emotion/styled';
import { ReactNode } from 'react';

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  max-width: 100%;
`;

interface PanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creates a simple Panel wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Panel({ children, className }: PanelProps) {
  return <StyledPanel className={className}>{children}</StyledPanel>;
}

export default Panel;
