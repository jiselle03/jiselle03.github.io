import styled from 'styled-components'
import { object } from 'prop-types'

export const Header = styled.header`
  margin: 2rem auto;
  max-width: 80vw;
`

export const Nav = styled.nav`      
  & > h2 {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 4rem);
  margin: 0 3rem;

  @media screen and (min-width: 768px) {
    max-width: 55vw;
    margin: 0 5rem;
  }
`

export const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 4rem);
  margin: 0 5rem;


`

export const Section = styled.section`
  margin: 1rem;
  margin-bottom: 3rem;
`

export const Footer = styled.footer`
  margin: 1rem 0 0 0;
`

export const Container = styled.div`
  margin: auto;
`

export const Divider = styled.hr`
  width: 60rem;
  max-width: 30vw;
  border: ${({ theme }) => `1px solid ${theme.primary}`};  
  border-radius: 2px;
  opacity: 0.5;
`

Divider.propTypes = {
  theme: object,
}
