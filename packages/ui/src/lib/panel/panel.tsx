import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useTheme } from '@emotion/react';

/**
 * Token -> CSS var map (keeps parity with typography / other primitives)
 */
const colorTokenToCssVar: Record<string, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  tertiary: 'var(--color-tertiary)',
  strong: 'var(--color-text-strong)',
  text: 'var(--color-text-primary)',
  white: 'var(--color-white)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-muted)',
  pokemonPrimary: 'var(--color-pokemonPrimary)',
  pokemonSecondary: 'var(--color-pokemonSecondary)',
  pokemonTertiary: 'var(--color-pokemonTertiary)',
};

const StyledPanel = styled.div<{
  $bg?: string | undefined;
  $color?: string | undefined;
  $rounded?: boolean | undefined;
  $padding?: string | undefined; // NEW
}>`
  display: block;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 100%;
  padding: ${({ $padding }) => $padding ?? 'var(--space-2)'}; /* CHANGED: use transient prop */
  box-shadow: none;
  box-sizing: border-box;

  /* background & color are pre-resolved and passed as transient props */
  background: ${({ $bg }) => $bg ?? 'var(--surface-bg, transparent)'};
  color: ${({ $color }) => $color ?? 'var(--surface-foreground)'};

  /* Rounded corners toggle (default: true) */
  border-radius: ${({ $rounded = true }) => ($rounded ? 'var(--radius-md)' : '0')};
`;

interface PanelProps {
  children: ReactNode;
  className?: string;
  /**
   * Background token name (e.g. "accent") OR raw CSS value:
   * - token name -> preferring theme.colors[token]
   * - CSS var / hex / function -> used as-is
   */
  background?: string;
  /**
   * Text color token name (e.g. "white") OR raw CSS value.
   */
  color?: string;
  /**
   * Toggle rounded corners. Default: true.
   */
  rounded?: boolean;
  /**
   * Optional padding override (e.g. "0", "8px", "var(--space-1)")
   */
  padding?: string;
}

/** Resolve a color-like value:
 *  - raw CSS tokens (var(...), #hex, rgb/rgba, gradients) are returned as-is
 *  - prefer theme.colors[name] if theme provides it
 *  - else check our CSS var map
 *  - fallback to var(--color-<name>, <name>)
 */
function resolveColorToken(value: string | undefined, theme: any): string | undefined {
  if (!value) return undefined;

  const looksLikeCss =
    value.startsWith('var(') ||
    value.startsWith('#') ||
    value.includes('(') ||
    /^rgba?\(/i.test(value);

  if (looksLikeCss) return value;

  const themeColors = theme?.colors || theme?.palette || undefined;
  if (themeColors && typeof themeColors === 'object' && themeColors[value]) {
    return themeColors[value];
  }

  if (colorTokenToCssVar[value]) return colorTokenToCssVar[value];

  return `var(--color-${value}, ${value})`;
}

export function Panel({ children, className, background, color, rounded = true, padding }: PanelProps) {
  const theme = useTheme() as any;
  const bgResolved = resolveColorToken(background, theme);
  const colorResolved = resolveColorToken(color, theme);

  return (
    <StyledPanel className={className} $bg={bgResolved} $color={colorResolved} $rounded={rounded} $padding={padding}>
      {children}
    </StyledPanel>
  );
}

export default Panel;