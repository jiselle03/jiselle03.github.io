import React from 'react';

import { Footer } from '../styles/Layout';
import { Hyperlink, Title } from '../styles/Typography';
import { links } from '../data';

const FooterSection = () => {
    return (
        <Footer>
            {links.map(link => (
                <Title as="h6" key={link.label}><Hyperlink href={link.url} target="blank">{link.label}</Hyperlink></Title>
            ))}
        </Footer>
    );
};

export default FooterSection;
