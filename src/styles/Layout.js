import styled from 'styled-components';

export const Header = styled.header`
    padding: 2rem;
    max-width: 95vw;
`;

export const Nav = styled.nav`      
    & > h2 {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
`;

export const Main = styled.main`
    margin: 2rem auto;
    width: 45rem;
    max-width: 80vw;
`;

export const Footer = styled.footer`
    margin: 2rem auto 0 auto;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    width: 45rem;
    max-width: 80vw;
`;

