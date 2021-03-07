import styled from 'styled-components';

export const Header = styled.header`
    padding: 2rem;
    display: flex;
    justify-content: space-between;
`;

export const Nav = styled.nav`      
    & > h2 {
        display: flex;
        flex-direction: column;
        text-align: right;

    @media screen and (min-width: 768px) {
        flex-direction: row;
    }
`;
