import styled from '@emotion/styled';
import { ReactNode } from 'react';

type StickyOption = 'sticky' | 'nonsticky';
type StickyPosition = 'top' | 'bottom';

const colorTokenToCssVar = (v?: string) => {
  if (!v) return undefined;
  // If caller passes a CSS var, hex, or a complex expression, use it directly
  if (v.startsWith('var(') || v.startsWith('#') || v.includes('(')) return v;
  // Otherwise treat as token name -> var(--color-<token>, <fallback>)
  return `var(--color-${v}, ${v})`;
};

const StyledHeader = styled.header<{
  $sticky?: StickyOption;
  $position?: StickyPosition;
  $offset?: string;
  $bg?: string | undefined;
  $color?: string | undefined;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2);
  width: 100%;
  box-sizing: border-box;

  /* Text color (allow token names or raw css values) */
  color: ${({ $color }) => $color ?? 'var(--surface-foreground)'};

  /* Visual style when sticky */
  background: ${({ $sticky, $bg }) =>
    $sticky === 'sticky'
      ? ($bg ?? 'var(--surface-bg, white)')
      : ($bg ?? 'transparent')};

  box-shadow: ${({ $sticky }) => ($sticky === 'sticky' ? '0 1px 0 rgba(0,0,0,0.04)' : 'none')};
  transition: background 150ms ease, box-shadow 150ms ease;

  /* Positioning */
  position: ${({ $sticky }) => ($sticky === 'sticky' ? 'sticky' : 'static')};
  top: ${({ $sticky, $position, $offset }) =>
    $sticky === 'sticky' && $position === 'top' ? ($offset ?? '0') : 'auto'};
  bottom: ${({ $sticky, $position, $offset }) =>
    $sticky === 'sticky' && $position === 'bottom' ? ($offset ?? '0') : 'auto'};
  z-index: ${({ $sticky }) => ($sticky === 'sticky' ? 'var(--z-header, 50)' : 'auto')};

  -webkit-backdrop-filter: ${({ $sticky }) => ($sticky === 'sticky' ? 'saturate(120%) blur(4px)' : 'none')};
  backdrop-filter: ${({ $sticky }) => ($sticky === 'sticky' ? 'saturate(120%) blur(4px)' : 'none')};
`;

interface HeaderProps {
  children: ReactNode;
  className?: string;
  sticky?: StickyOption;               // 'sticky' | 'nonsticky'
  position?: StickyPosition;           // 'top' | 'bottom'
  offset?: string;                     // any valid CSS size, e.g. '0', 'env(safe-area-inset-top)', '64px'
  /**
   * Optional text color. Accepts:
   * - token name like "accent" -> resolves to var(--color-accent)
   * - full css var "var(--surface-foreground)"
   * - raw color "#fff" or "rgba(...)"
   */
  color?: string;
  /**
   * Optional background. Accepts token name like "accent" (-> var(--color-accent))
   * or raw CSS values.
   */
  background?: string;
}

export function Header({
  children,
  className,
  sticky = 'nonsticky',
  position = 'top',
  offset,
  color,
  background,
}: HeaderProps) {
  const resolvedColor = colorTokenToCssVar(color);
  const resolvedBg = colorTokenToCssVar(background);
  return (
    <StyledHeader
      className={className}
      $sticky={sticky}
      $position={position}
      $offset={offset}
      $color={resolvedColor}
      $bg={resolvedBg}
    >
      {children}
    </StyledHeader>
  );
}

export default Header;