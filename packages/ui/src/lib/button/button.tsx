import styled from '@emotion/styled';
import { ReactNode, MouseEventHandler } from 'react';

const StyledButton = styled.div`
  color: pink;
`;

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
};

/**
 * Creates a simple Button
 * TODO: develop actual component on an upcoming branch
 */
export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <StyledButton onClick={onClick} className={className}>
      {children ?? <h1>Welcome to Button!</h1>}
    </StyledButton>
  );
}

export default Button;
