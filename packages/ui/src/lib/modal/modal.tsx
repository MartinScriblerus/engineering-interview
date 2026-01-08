import styled from '@emotion/styled';

import { Portal } from '../portal/portal';
import { useState } from 'react';
import { Button } from '../button/button';
import { Typography} from '../typography/typography'


/**
 * Creates a reusable Modal composite
 * TODO: develop actual component on an upcoming branch
 */
export function Modal() {
  const [open, setOpen] = useState(false);

  const InnerModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      {open && (
        <Portal containerId="modal-root">
          <InnerModalWrapper>
            <div style={{ background: 'white', padding: 20 }}>
              <Typography>Modal Content</Typography>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </InnerModalWrapper>
        </Portal>
      )}
    </>
  );
}