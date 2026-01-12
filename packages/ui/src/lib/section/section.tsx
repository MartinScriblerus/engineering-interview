import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface StyledSectionProps {
  $bg?: string;
  $fg?: string;
  $padding?: string;
  $radius?: string;
  $gap?: string;
  $direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $wrap?: boolean;
  $center?: boolean;
}

const StyledSection = styled.div<StyledSectionProps>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  position: relative;
  width: 100%;
  min-width: 0;
  flex: 1 1 auto;
  min-height: 0;
  flex-wrap: ${({ $wrap = false }) => ($wrap ? 'wrap' : 'nowrap')};

  /* stretch children vertically by default; center if $center is true */
  align-items: ${({ $center }) => ($center ? 'center' : 'stretch')};
  justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};

  gap: ${({ $gap = '0' }) => $gap};
  background-color: ${({ $bg }) => $bg ?? 'var(--surface-bg, transparent)'};
  color: ${({ $fg }) => $fg ?? 'var(--surface-foreground, inherit)'};
  padding: ${({ $padding = '0' }) => $padding};
  border-radius: ${({ $radius = '0' }) => $radius};
  text-align: left;
  overflow: visible;
`;

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: string;
  fg?: string;
  padding?: string;
  radius?: string;
  gap?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: boolean;
  center?: boolean;
}

export function Section({
  children,
  className,
  bg,
  fg,
  padding,
  radius,
  gap,
  direction = 'row',
  wrap = false,
  center = false,
}: SectionProps) {
  return (
    <StyledSection
      className={className}
      $bg={bg}
      $fg={fg}
      $padding={padding}
      $radius={radius}
      $gap={gap}
      $direction={direction}
      $wrap={wrap}
      $center={center}
    >
      {children}
    </StyledSection>
  );
}

export default Section;