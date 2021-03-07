import styled from 'styled-components';

export const Title = styled.h1`
`;

export const Text = styled.p`
`;

export const Hyperlink = styled.a`
`;

export const Mark = styled.mark`
    display: inline-block;
    line-height: 0em;
    padding-bottom: 0.5em;
    padding-left: 1.5em;
    background-color: ${({ color }) => color ? color : "#000"};
`;