import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface SpacerProps {
  size?: number | string; // spacing value, default 8px
  axis?: 'vertical' | 'horizontal'; // default vertical
  className?: string;
  children?: ReactNode; // optional
}

const StyledSpacer = styled.div<SpacerProps>`
  display: block;
  width: ${({ axis, size }) => (axis === 'horizontal' ? size || '8px' : '100%')};
  height: ${({ axis, size }) => (axis === 'vertical' ? size || '8px' : '100%')};
  flex-shrink: 0;
`;

/**
 * Creates a simple Spacing wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Spacer({ size = '8px', axis = 'vertical', className }: SpacerProps) {
  return <StyledSpacer size={size} axis={axis} className={className} />;
}

export default Spacer;