import React from 'react'
import { Link } from 'react-router-dom'
import { Main, Divider, Footer } from '../styles/Layout'
import { links } from '../data'

const PortfolioPage = () => {
  return (
    <Main>
      <p>This page is currently under construction.</p>
      <Divider />
      <Footer>
        <small>Jiselle Liu</small>
        {links.map(link => (
            <a key={link.label} href={link.url} target="blank"><small>{link.label}</small></a> 
        ))}
        <br />
        <Link to="/"><small>{'<<<'} Back to main</small></Link>
      </Footer>
    </Main>
  )
}

export default PortfolioPage
