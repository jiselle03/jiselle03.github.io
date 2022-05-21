import React from 'react'
import { Link } from 'react-router-dom'
import { NavSection } from '../styles/Layout'
import { Divider, Footer } from '../styles/Layout'

const WelcomePage = () => {
  return (
    <NavSection>
      <Link to="/about">About</Link>
      <Link to="/portfolio">Portfolio</Link>
      <a href="mailto:hello@jiselleliu.com">Contact</a>
      <Divider />
      <Footer>
        <p><b>Jiselle Liu</b>, Web Developer</p>
      </Footer>
    </NavSection>
  )
}

export default WelcomePage
