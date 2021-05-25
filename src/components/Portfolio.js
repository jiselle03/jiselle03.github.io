import React from 'react';

import { Container } from '../styles/Layout';
import { Hyperlink, Text, Title } from '../styles/Typography';

const Portfolio = () => {
    return (
        <>
            <Title as="h2" margin="0 0 1rem 0" uppercase>Portfolio</Title>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://mantisxr.com" target="blank">Mantis XR</Hyperlink>
                </Title>
                <Text as="small">jQuery, PHP, A-Frame, Node.js || React</Text>
            </Container>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://youtube.com/watch?v=Co3HGeTybeE" target="blank">Techrollmancer</Hyperlink>
                </Title>
                <Text as="small">React, Ruby on Rails</Text>
            </Container>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://booknroll.herokuapp.com" target="blank">
                        Book 'n Roll
                    </Hyperlink>
                </Title>
                <Text as="small">Ruby on Rails</Text>
            </Container>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://esenfriend.com" target="blank">ēSEN Friend</Hyperlink> | <Hyperlink href="https://esenmedical.com" target="blank">ĒSEN Medical</Hyperlink>
                </Title>
                <Text as="small">Wordpress</Text>
            </Container>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://medura.ca" target="blank">Medura</Hyperlink>
                </Title>
                <Text as="small">Shopify</Text>
            </Container>

            <Container>
                <Title as="h3">
                    <Hyperlink href="https://vetomaskspro.com" target="blank">Veto Masks Pro</Hyperlink>
                </Title>
                <Text as="small">Wix</Text>
            </Container>

            <Container>
                <Title as="h3">TBA</Title>
                <Text as="small">React, Golang</Text>
            </Container>
        </>
    );
};

export default Portfolio;
