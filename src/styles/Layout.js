import styled from 'styled-components';
import { object } from 'prop-types';

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

export const Section = styled.section`
    margin: 1rem;
    margin-bottom: 5rem;
`;

export const Footer = styled.footer`
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    width: 45rem;
    max-width: 80vw;
`;

export const Container = styled.div`
    margin: 1rem auto;
`;

export const Divider = styled.hr`
    width: 60rem;
    max-width: 90vw;
    margin: auto;
    border: ${({ theme }) => `2px solid ${theme.primary}`};  
    border-radius: 5px;
    opacity: 0.5;
`;

Divider.propTypes = {
    theme: object,
};
