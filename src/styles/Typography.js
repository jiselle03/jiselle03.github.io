import styled from 'styled-components';
import { bool, string } from 'prop-types';

export const Title = styled.h1`
    ${({ align }) => align && `text-align: ${align}`};
    ${({ margin }) => margin && `margin: ${margin}`};
    ${({ uppercase }) => uppercase && `text-transform: uppercase`};
`;

Title.propTypes = {
    align: string,
    margin: string,
    uppercase: bool,
};

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

Mark.propTypes = {
    color: string,
};
