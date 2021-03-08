import React from 'react';

import Bio from '../components/Bio';
import Portfolio from '../components/Portfolio';
import { Section } from '../styles/Layout';

const WelcomePage = () => {
    return (
        <>
            <Section>
                <Bio />
            </Section>

            <Section>
                <Portfolio />
            </Section>
        </>
    );
};

export default WelcomePage;
