import React from 'react';

import Bio from '../components/Bio';
import { Section } from '../styles/Layout';

const WelcomePage = () => {
    return (
        <>
            <Section>
                <Bio />
            </Section>
        </>
    );
};

export default WelcomePage;
