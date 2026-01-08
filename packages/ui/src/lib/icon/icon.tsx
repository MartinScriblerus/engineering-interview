import styled from '@emotion/styled';

const StyledIcon = styled.div`
  color: pink;
`;

/**
 * Creates a simple Icon placeholder
 * TODO: develop actual component on an upcoming branch
 */
export function Icon() {
  return (
    <StyledIcon>
      <h1>Welcome to Icon!</h1>
    </StyledIcon>
  );
}

export default Icon;
