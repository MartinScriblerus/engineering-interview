import styled from '@emotion/styled';

const StyledViewport = styled.div`
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface ViewportProps {
  children: ReactNode;
  className?: string;
}


/**
 * Creates a simple Viewport wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Viewport({ children, className }: ViewportProps) {
  return <StyledViewport className={className}>{children}</StyledViewport>;
}

export default Viewport;