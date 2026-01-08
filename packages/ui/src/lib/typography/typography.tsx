import styled from '@emotion/styled';

type TypographyProps = {
  children: React.ReactNode;
  size?: 'xs' | 's' | 'md' | 'lg';
  weight?: 'normal' | 'bold' | 'bolder';
  italic?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | string;
  as?: keyof JSX.IntrinsicElements; // allow h1, p, span, etc.
};

const sizeMap = {
  xs: '0.75rem',
  s: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
};

const weightMap = {
  normal: 400,
  bold: 700,
  bolder: 900,
};

const colorMap = {
  primary: '#111',
  secondary: '#666',
  tertiary: '#aac'
};

const StyledTypography = styled.div<TypographyProps>`
  font-size: ${({ size = 'md' }) => sizeMap[size]};
  font-weight: ${({ weight = 'normal' }) => weightMap[weight]};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  color: ${({ color = 'primary' }) =>
    colorMap[color as keyof typeof colorMap] || color};
`;

/**
 * Creates a configurable typography wrapper
 * TODO: develop actual component on an upcoming branch
 */
export function Typography({
  children,
  as = 'span',
  size = 'md',
  weight = 'normal',
  italic = false,
  color = 'primary',
}: TypographyProps) {
  return (
    <StyledTypography
      as={as}
      size={size}
      weight={weight}
      italic={italic}
      color={color}
    >
      {children}
    </StyledTypography>
  );
}

export default Typography;