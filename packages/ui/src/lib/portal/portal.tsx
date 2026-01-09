import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePortal } from '../../utils/portal';

const StyledPortal = styled.div`
  color: pink;
`;

interface PortalProps {
  children?: ReactNode;
  className?: string;
  /**
   * ID of the container element to render the portal into.
   * If the element does not exist it will be created on first render.
   */
  containerId?: string;
}

/**
 * Portal component that renders children into a DOM node outside the
 * normal React tree using `createPortal` and the `usePortal` hook.
 */
export function Portal({ children, className, containerId = 'portal-root' }: PortalProps) {
  const root = usePortal(containerId);

  if (!root) return null;

  return createPortal(<StyledPortal className={className}>{children}</StyledPortal>, root);
}

export default Portal;