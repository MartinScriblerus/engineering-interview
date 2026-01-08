import styled from '@emotion/styled';

const StyledPortal = styled.div`
  color: pink;
`;

interface PortalProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creates a simple Portal wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Portal({ children, className }: PortalProps) {
  return <StyledPortal className={className}>{children}</StyledPortal>;
}

export default Portal;
