import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useTheme } from '@emotion/react';

interface ViewportProps {
  children: ReactNode;
  className?: string;
  background?: string;
}

const StyledViewport = styled.div<{ $bg?: string }>`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ $bg }) => $bg ?? 'var(--surface-bg, white)'};
  color: var(--surface-foreground, #111);
  box-sizing: border-box;
`;

const colorTokenToCssVar: Record<string, string> = {
  surface: 'var(--surface-bg)',
  heroBg: 'var(--color-hero-bg)',
  accent: 'var(--color-accent)',
};

export function Viewport({ children, className, background }: ViewportProps) {
  const theme = useTheme() as any;

  let resolvedBg: string | undefined;

  if (typeof background === 'string') {
    // prefer theme.colors.token if provided
    if (theme?.colors && theme.colors[background]) resolvedBg = theme.colors[background];
    else if (colorTokenToCssVar[background]) resolvedBg = colorTokenToCssVar[background];
    else resolvedBg = background;
  }

  const themeBg = resolvedBg ?? (theme?.colors?.surface ?? undefined);

  return (
    <StyledViewport className={className} $bg={themeBg}>
      {children}
    </StyledViewport>
  );
}