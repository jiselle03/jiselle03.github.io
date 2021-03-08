import React from 'react';

import { Hyperlink, Text, Title } from '../styles/Typography';

const Bio = () => {
    return (
        <>
            <Title as="h5">Full stack web developer currently based in Vancouver, BC 🇨🇦</Title>

            <Text>
                Former project manager and Bay Area resident, <br />
                <Hyperlink href="https://berkeley.edu" target="blank">Cal</Hyperlink> grad (Go Bears! 🐻), Taiwan native 🇹🇼, <br />
                D&D and sour ale enthusiast. 
            </Text>
            <Text>
                In my free time, I like playing around with web technologies and testing new recipes.
            </Text>
            <Text>
                My pronouns are she/they/他.
            </Text>
            <Text>
                Available for freelance opportunities at <Hyperlink href="mailto:hello@jiselleliu.com">hello@jiselleliu.com</Hyperlink>.
            </Text>
            <Text as="small">
                JavaScript, Express, React, jQuery, Ruby on Rails, Python, Golang, Gorilla Mux, PostgreSQL, MongoDB, Knex.js, HTML, CSS, Wordpress, Shopify
            </Text>
        </>
    );
};

export default Bio;
