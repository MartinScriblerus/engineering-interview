import styled from '@emotion/styled';
import { ReactNode, MouseEventHandler } from 'react';
import { useTheme } from '@emotion/react';

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

const StyledButton = styled.button<{
  $bg?: string | undefined;
  $color?: string | undefined;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center; /* center horizontally and vertically */
  gap: var(--space-2);
  background: ${({ $bg }) => $bg ?? 'var(--color-accent)'};
  color: ${({ $color }) => $color ?? 'var(--color-white)'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  max-width: 320px;
  min-width: 120px; /* smaller min width for flexible text, keeps reasonable hit area */
  min-height: 44px; /* 44px recommended touch target height */
  text-align: center;
  line-height: 1;
  font-size: 1rem;
  box-sizing: border-box;
  transition: background var(--transition-duration) var(--transition-ease), filter var(--transition-duration) var(--transition-ease),
    box-shadow var(--transition-duration) var(--transition-ease);

  &:hover:not([disabled]) {
    filter: brightness(0.95);
  }
  &:active:not([disabled]) {
    filter: brightness(0.9);
  }

  /* Strong, visible keyboard focus */
  &:focus {
    outline: none;
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.35); /* accessible focus ring */
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    filter: none;
  }

  /* Ensure text wraps nicely (if long) and stays centered */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** Button props
 * - `ariaLabel` is required for icon-only buttons to provide an accessible name.
 */
type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  background?: string;
  color?: string;
  disabled?: boolean;
  /**
   * When the visible label is not descriptive (e.g. icon-only button),
   * provide an accessible name via `ariaLabel`.
   */
  ariaLabel?: string;
  /**
   * Optional title tooltip (used when ariaLabel provided)
   */
  title?: string;
};

export function Button({
  children,
  onClick,
  className,
  type = 'button',
  background,
  color,
  disabled,
  ariaLabel,
  title,
}: ButtonProps) {
  const theme = useTheme() as any;
  const bgResolved = resolveColorToken(background, theme);
  const colorResolved = resolveColorToken(color, theme);

  // If the button is icon-only, consumer should pass ariaLabel — we still render,
  // but prefer an explicit accessible name.
  const hasTextContent = typeof children === 'string' || (Array.isArray(children) && children.some((c) => typeof c === 'string'));

  return (
    <StyledButton
      onClick={onClick}
      className={className}
      type={type}
      $bg={bgResolved}
      $color={colorResolved}
      disabled={disabled}
      aria-disabled={disabled ? 'true' : undefined}
      aria-label={!hasTextContent && ariaLabel ? ariaLabel : undefined}
      title={title ?? (ariaLabel && !hasTextContent ? ariaLabel : undefined)}
    >
      {children}
    </StyledButton>
  );
}

export default Button;