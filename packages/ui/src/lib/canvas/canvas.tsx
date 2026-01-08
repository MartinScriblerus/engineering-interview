import styled from '@emotion/styled';

const StyledCanvas = styled.div`
  color: pink;
`;


/**
 * Creates a simple Canvas
 * TODO: develop actual component on an upcoming branch
 */
export function Canvas() {
  return (
    <StyledCanvas>
      <h1>Welcome to Canvas!</h1>
    </StyledCanvas>
  );
}

export default Canvas;
