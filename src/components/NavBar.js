import React from 'react';
import { Link } from 'react-router-dom';

import { Header, Nav } from '../styles/Header';
import { Title, Hyperlink } from '../styles/Typography';

const NavBar = () => {
    return (
        <Header>
            <Title>
                <Link to="/">Jiselle Liu</Link>
            </Title>
            <Nav>
                <Title as="h2">
                    <Hyperlink href="https://linkedin.com/in/jiselleliu">&nbsp; LinkedIn &nbsp;</Hyperlink> 
                    <Hyperlink href="https://github.com/jiselle03">&nbsp; Github &nbsp;</Hyperlink>
                    <Hyperlink href="mailto:hello@jiselleliu.com">&nbsp; Contact &nbsp;</Hyperlink>
                </Title>
            </Nav>
        </Header>
    );
};

export default NavBar;
