import styled from '@emotion/styled';

const StyledImage = styled.div`
  color: pink;
`;


/**
 * Creates a simple Image
 * TODO: develop actual component on an upcoming branch
 */
export function Image() {
  return (
    <StyledImage>
      <h1>Welcome to Image!</h1>
    </StyledImage>
  );
}

export default Image;
