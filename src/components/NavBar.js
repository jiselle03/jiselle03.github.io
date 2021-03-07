import React from 'react';
import { Link } from 'react-router-dom';

import { Header, Nav } from '../styles/Layout';
import { Mark, Title, Hyperlink } from '../styles/Typography';
import { links } from '../data';

const NavBar = () => {
    return (
        <Header>
            <Title>
                <Link to="/">Jiselle Liu</Link>
            </Title>
            <Nav>
                <Title as="h2">
                    <Mark>
                        {links.map(link => (
                            <Hyperlink key={link.label} href={link.url} target="blank">&nbsp; {link.label} &nbsp;</Hyperlink> 
                        ))}
                    </Mark>
                </Title>
            </Nav>
        </Header>
    );
};

export default NavBar;
