import { createGlobalStyle } from 'styled-components';

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
    color: ${({ theme }) => theme.secondary};
  }

  div#root {
    min-height: 100vh;
  }

  h1 {
    font-family: ${({ theme }) => theme.title};
    margin-bottom: 1rem;   
    text-align: right;

    @media screen and (min-width: 768px) {
      margin-bottom: 2rem;  
    }
  } 

  h2, h3, h4, h5, h6, p, li, small, a {
    font-family: ${({ theme }) => theme.text};
  }

  h1 {
    font-size: 1.5rem;

    @media screen and (min-width: 768px) {
      font-size: 3rem;
    }
  }

  h2 {
    font-size: 1rem;
    color: ${({ theme }) => theme.primary};

    @media screen and (min-width: 768px) {
      font-size: 2rem;
    }
  }

  h3 {
    font-size: 1rem;

    @media screen and (min-width: 768px) {
      font-size: 1.75rem;
    }
  }

  h5 {
    font-weight: 700;
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  h6 {
    font-weight: 700;
    font-size: 1.1rem;
  }

  p, li, a {
    font-weight: 400;
    font-size: 1rem;
    line-height: 2.25rem;
    margin-bottom: 1rem;

    @media screen and (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  small {
    font-weight: 300;
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }

  ol, ul {
    list-style: none;
  }
`

export default GlobalStyles
