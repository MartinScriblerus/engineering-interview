import styled from '@emotion/styled';

const StyledSection = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  max-width: 100%;
`;

interface SectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creates a simple Section wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Section({ children, className }: SectionProps) {
  return <StyledSection className={className}>{children}</StyledSection>;
}

export default Section;
