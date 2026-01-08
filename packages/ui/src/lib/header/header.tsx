import styled from '@emotion/styled';

const StyledHeader = styled.div`
  color: pink;
`;

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creates a simple Header wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Header({ children, className }: HeaderProps) {
  return <StyledHeader className={className}>{children}</StyledHeader>;
}

export default Header;