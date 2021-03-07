import { createGlobalStyle } from 'styled-components';
import { object } from 'prop-types';

const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
    }

    *, *:before, *:after {
        box-sizing: inherit;
        margin: 0;
        padding: 0;
    }

    body {
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.primary};
    }

    h1, h2, h3, h4, h5 {
        font-family: ${({ theme }) => theme.title};        
    }

    h6, p, li {
        font-family: ${({ theme }) => theme.text};
    }

    h6 {
        font-weight: 700;
        font-size: 1.75rem;
    }

    p, li {
        font-weight: 400;
        font-size: 1.5rem;
    }

    a {
        font-family: inherit;
        text-decoration: none;
        color: ${({ theme }) => theme.primary};
    }

    ol, ul {
        list-style: none;
    }

    h1 {
        font-size: 1.5rem;

        @media screen and (min-width: 768px) {
            font-size: 3rem;
        }
    }

    h2 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1rem;

        @media screen and (min-width: 768px) {
            font-size: 1.75rem;
        }
    }

    `;

export default GlobalStyles;

GlobalStyles.propTypes = {
    theme: object,
};
