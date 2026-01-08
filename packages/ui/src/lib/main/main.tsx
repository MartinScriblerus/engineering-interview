import styled from '@emotion/styled';

const StyledMain = styled.div`
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

interface MainProps {
  children: ReactNode;
  className?: string;
}


/**
 * Creates a simple Main wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Main({ children, className }: MainProps) {
  return <StyledMain className={className}>{children}</StyledMain>;
}

export default Main;
