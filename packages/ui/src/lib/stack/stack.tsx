import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useTheme } from '@emotion/react';

type ScrollOption = 'none' | 'vertical' | 'horizontal' | 'both';

interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; // default: column
  spacing?: number | string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  scroll?: ScrollOption;
  maxHeight?: number | string;
  maxWidth?: number | string;
  /**
   * Padding to apply on the top of the stack.
   * Accepts a number (pixels) or any CSS size string ('8px', '0.5rem').
   * Use paddingTop rather than marginTop so scroll areas and sticky headers
   * behave predictably.
   */
  paddingTop?: number | string;
  /**
   * Background token name (e.g. 'pokemonPrimary') or raw CSS color (e.g. '#fff', 'var(--foo)')
   */
  background?: string;
  className?: string;
}

const toCssSize = (v?: number | string) => (v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v);

const StyledStack = styled.div<{
  $direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $spacing?: number | string;
  $align?: StackProps['align'];
  $justify?: StackProps['justify'];
  $scroll?: ScrollOption | undefined;
  $maxHeight?: string;
  $maxWidth?: string;
  $paddingTop?: string | undefined;
  $bg?: string | undefined;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'column'};
  gap: ${({ $spacing }) => ($spacing != null ? (typeof $spacing === 'number' ? `${$spacing}px` : $spacing) : '8px')};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  box-sizing: border-box;
  height: 100%;

  /* Padding on top (preferred over margin-top for scrollable lists) */
  padding-top: ${({ $paddingTop }) => ($paddingTop ? $paddingTop : '0')};

  ${({ $maxHeight }) => ($maxHeight ? `max-height: ${$maxHeight};` : '')}
  ${({ $maxWidth }) => ($maxWidth ? `max-width: ${$maxWidth};` : '')}

  /* Background */
  background-color: ${({ $bg }) => $bg ?? 'transparent'};

  /* Scrolling behavior:
     - explicit $scroll wins
     - if $scroll is undefined, derive from presence of maxHeight / maxWidth
     - default: no scroll */
  ${({ $scroll, $maxHeight, $maxWidth }) => {
    if ($scroll === 'vertical') return 'overflow-y: auto; overflow-x: hidden;';
    if ($scroll === 'horizontal') return 'overflow-x: auto; overflow-y: hidden;';
    if ($scroll === 'both') return 'overflow: auto;';
    if ($scroll === 'none') return 'overflow: visible;';

    // scroll not provided: derive from max sizes
    const parts: string[] = [];
    if ($maxHeight) parts.push('overflow-y: auto;');
    if ($maxWidth) parts.push('overflow-x: auto;');
    return parts.join(' ') || '';
  }}
`;

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

  // fallback token -> css var
  return `var(--color-${value}, ${value})`;
}

export function Stack({
  children,
  direction = 'column',
  spacing = '8px',
  align,
  justify,
  scroll, // default: undefined -> derive from max sizes if present
  maxHeight,
  maxWidth,
  paddingTop,
  background,
  className,
}: StackProps) {
  const theme = useTheme() as any;
  const maxHeightCss = toCssSize(maxHeight);
  const maxWidthCss = toCssSize(maxWidth);
  const paddingTopCss = toCssSize(paddingTop);
  const bgResolved = resolveColorToken(background, theme);

  return (
    <StyledStack
      $direction={direction}
      $spacing={spacing}
      $align={align}
      $justify={justify}
      $scroll={scroll}
      $maxHeight={maxHeightCss}
      $maxWidth={maxWidthCss}
      $paddingTop={paddingTopCss}
      $bg={bgResolved}
      className={className}
    >
      {children}
    </StyledStack>
  );
}

export default Stack;