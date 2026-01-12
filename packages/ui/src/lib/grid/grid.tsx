import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  className?: string;
  columns?: number | string; // number = repeat(n, 1fr), string = raw grid-template-columns
  rows?: string;              // optional grid-template-rows
  gap?: string;               // spacing between items, e.g., '1rem'
  align?: 'start' | 'center' | 'end' | 'stretch'; // align-items
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around'; // justify-items
  wrap?: boolean;             // not used for CSS Grid directly; kept for API parity
}

const StyledGrid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ columns }) =>
    typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns || '1fr'};
  grid-template-rows: ${({ rows }) => rows || 'auto'};
  gap: ${({ gap }) => gap || '1rem'};
  align-items: ${({ align }) => align || 'stretch'};
  justify-items: ${({ justify }) => justify || 'stretch'};
`;

export function Grid({
  children,
  className,
  columns,
  rows,
  gap,
  align,
  justify,
}: GridProps) {
  return (
    <StyledGrid
      className={className}
      columns={columns}
      rows={rows}
      gap={gap}
      align={align}
      justify={justify}
    >
      {children}
    </StyledGrid>
  );
}

export default Grid;