import styled from '@emotion/styled';
import React from 'react';
import { useTheme } from '@emotion/react';

type Variant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'muted';

type TypographyProps = {
  children: React.ReactNode;
  variant?: Variant;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'bolder';
  italic?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | string;
  as?: React.ElementType;
  truncate?: boolean;
  uppercase?: boolean;
  className?: string;
};

const variantMap: Record<Variant, { fontSize: string; lineHeight: string; letterSpacing?: string }> = {
  display: { fontSize: 'var(--typo-display-size, 3rem)', lineHeight: 'var(--typo-display-line-height, 1)', letterSpacing: '-0.02em' },
  heading: { fontSize: 'var(--typo-heading-size, 1.25rem)', lineHeight: '1.4', letterSpacing: '-0.02em' },
  subheading: { fontSize: 'var(--typo-subheading-size, 1rem)', lineHeight: '1.5', letterSpacing: '-0.01em' },
  body: { fontSize: 'var(--typo-body-size, 1rem)', lineHeight: '1.5' },
  caption: { fontSize: 'var(--typo-caption-size, 0.875rem)', lineHeight: '1.25' },
  muted: { fontSize: '0.75rem', lineHeight: '1', letterSpacing: '0' },
};

const weightMap = {
  normal: 'var(--typo-weight-normal, 400)',
  medium: 'var(--typo-weight-medium, 500)',
  semibold: 'var(--typo-weight-semibold, 600)',
  bold: 'var(--typo-weight-bold, 700)',
  bolder: 'var(--typo-weight-bolder, 900)',
};

const defaultVariantForTag: Record<string, Variant> = {
  h1: 'display',
  h2: 'heading',
  h3: 'subheading',
  h4: 'heading',
  h5: 'subheading',
  h6: 'subheading',
  p: 'body',
  span: 'body',
  small: 'caption',
  div: 'body',
  label: 'body',
};

const defaultWeightForTag: Record<string, keyof typeof weightMap> = {
  h1: 'bolder',
  h2: 'bold',
  h3: 'semibold',
  h4: 'semibold',
  p: 'normal',
  span: 'normal',
};

const defaultColorForTag: Record<string, string> = {
  h1: 'var(--color-text-strong)',
  h2: 'var(--color-text-strong)',
  p: 'var(--color-text-primary)',
  span: 'var(--color-text-primary)',
};

const colorTokenToCssVar: Record<string, string> = {
  primary: 'var(--color-primary)',
  strong: 'var(--color-text-strong)',
  text: 'var(--color-text-primary)',
  white: 'var(--color-white)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-muted)',
  pokemonPrimary: 'var(--color-pokemonPrimary)',
  pokemonSecondary: 'var(--color-pokemonSecondary)',
  pokemonTertiary: 'var(--color-pokemonTertiary)'
};

type TransientProps = {
  $as?: React.ElementType;
  $variant: Variant;
  $weight: keyof typeof weightMap;
  $italic?: boolean;
  $colorResolved?: string;
  $truncate?: boolean;
  $uppercase?: boolean;
};

const StyledTypography = styled.div<TransientProps>`
  margin: 4px;
  padding: 4px;
  color: ${({ $colorResolved = 'var(--color-text-primary)' }) => $colorResolved};
  font-size: ${({ $variant = 'body' }) => variantMap[$variant].fontSize};
  line-height: ${({ $variant = 'body' }) => variantMap[$variant].lineHeight};
  letter-spacing: ${({ $variant = 'body' }) => variantMap[$variant].letterSpacing ?? 'normal'};
  font-weight: ${({ $weight = 'normal' }) => weightMap[$weight]};
  font-style: ${({ $italic }) => ($italic ? 'italic' : 'normal')};

  /* Display: inline for captions/spans/a; block otherwise (simple heuristic) */
  display: ${({ $variant = 'body', $as }) =>
    $variant === 'caption' || $as === 'span' || $as === 'a' ? 'inline' : 'block'};

  text-transform: ${({ $uppercase }) => ($uppercase ? 'uppercase' : 'none')};

  ${({ $truncate }) =>
    $truncate
      ? `
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      `
      : ''}

  @media screen and (min-width: 768px) {
    ${({ $variant = 'body' }) =>
      $variant === 'display'
        ? 'font-size: var(--typo-display-size-md, 3.5rem);'
        : ''}
  }

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export function Typography({
  children,
  as = 'span',
  variant,
  weight,
  italic = false,
  color,
  truncate = false,
  uppercase = false,
  className,
}: TypographyProps) {
  const theme = useTheme() as any;

  // If `as` is an intrinsic tag string, use it for defaults. If it's a component, don't infer from it.
  const tagName = typeof as === 'string' ? as.toLowerCase() : undefined;

  // variant precedence: explicit variant -> inferred from tag -> fallback 'body'
  const effectiveVariant: Variant =
    (variant as Variant) ?? (tagName && (defaultVariantForTag[tagName] as Variant)) ?? 'body';

  // weight precedence: explicit weight -> inferred from tag -> fallback 'normal'
  const effectiveWeight = (weight as keyof typeof weightMap) ?? (tagName && defaultWeightForTag[tagName]) ?? 'normal';

  // color precedence:
  // 1) explicit color prop (string)
  // 2) theme.colors[color] if theme exists
  // 3) color token mapping (CSS var)
  // 4) default color for tag
  // 5) final fallback
  let resolvedColor = 'var(--color-text-primary)';
  if (typeof color === 'string') {
    if (theme?.colors && theme.colors[color]) {
      resolvedColor = theme.colors[color];
    } else if (colorTokenToCssVar[color]) {
      resolvedColor = colorTokenToCssVar[color];
    } else {
      // assume it's a literal CSS color or var(...)
      resolvedColor = color;
    }
  } else if (tagName && defaultColorForTag[tagName]) {
    resolvedColor = defaultColorForTag[tagName];
  }

  return (
    <StyledTypography
      as={as}
      $as={as}
      $variant={effectiveVariant}
      $weight={effectiveWeight}
      $italic={italic}
      $colorResolved={resolvedColor}
      $truncate={truncate}
      $uppercase={uppercase}
      className={className}
    >
      {children}
    </StyledTypography>
  );
}

export default Typography;