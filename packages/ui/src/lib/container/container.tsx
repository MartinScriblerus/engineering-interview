import styled from '@emotion/styled';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
`;

/**
 * Creates a simple Container wrapper for large UI blocks
 * TODO: develop actual component on an upcoming branch
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return <StyledContainer className={className}>{children}</StyledContainer>;
}

export default Container;
