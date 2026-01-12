import styled from '@emotion/styled';
import { ReactNode } from 'react';

const StyledContainer = styled.div<{
  $noPadding?: boolean;
  $paddingLeft?: string | undefined;
  $paddingRight?: string | undefined;
  $paddingBottom?: string | undefined;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;

  /* configurable padding (default kept for backwards compatibility) */
  padding-left: ${({ $noPadding, $paddingLeft }) =>
    $noPadding ? '0' : $paddingLeft ?? 'var(--space-2)'};
  padding-right: ${({ $noPadding, $paddingRight }) =>
    $noPadding ? '0' : $paddingRight ?? 'var(--space-2)'};
  padding-bottom: ${({ $noPadding, $paddingBottom }) =>
    $noPadding ? '0' : $paddingBottom ?? 'var(--space-4)'};
`;

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Remove the default container padding (left/right/bottom).
   */
  noPadding?: boolean;
  paddingLeft?: string;
  paddingRight?: string;
  paddingBottom?: string;
}

export function Container({
  children,
  className,
  noPadding,
  paddingLeft,
  paddingRight,
  paddingBottom,
}: ContainerProps) {
  return (
    <StyledContainer
      className={className}
      $noPadding={noPadding}
      $paddingLeft={paddingLeft}
      $paddingRight={paddingRight}
      $paddingBottom={paddingBottom}
    >
      {children}
    </StyledContainer>
  );
}

export default Container;