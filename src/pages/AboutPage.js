import React from 'react'
import { Link } from 'react-router-dom'
import { Main, Divider, Footer } from '../styles/Layout'
import { links } from '../data'

const AboutPage = () => {
  return (
    <Main>
      <p>
        Web Developer, former project manager,&nbsp;
        <a href="https://berkeley.edu" target="blank">Cal</a> grad (Go Bears! 🐻).<br />
        D&D and sour ale enthusiast, Warriors fan. <br />
        Currently building freight e-commerce and payment solutions at BlueX Trade.
      </p>
      <small>TECHNICAL SKILLS</small>
      <p>TypeScript, Vue, React, Express, Ruby on Rails, Golang, PostGreSQL, MongoDB, HTML, CSS</p>
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

export default AboutPage
