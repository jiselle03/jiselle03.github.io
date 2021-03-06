import React from 'react';

import { Hyperlink, Text, Title } from '../styles/Typography';

const Bio = () => {
    return (
        <>
            <Title as="h5">Full stack web developer currently based in Taipei</Title>

            <Text>
                Former project manager and Bay Area resident, <br />
                <Hyperlink href="https://berkeley.edu" target="blank">Cal</Hyperlink> grad (Go Bears! ๐ป), Taiwan native ๐น๐ผ, <br />
                D&D and sour ale enthusiast. 
            </Text>
            <Text>
                In my free time, I like playing around with web technologies and testing new recipes.
            </Text>
            <Text>
                My pronouns are she/they/ไป.
            </Text>
            <Text>
                Available for freelance opportunities at <Hyperlink href="mailto:hello@jiselleliu.com">hello@jiselleliu.com</Hyperlink>.
            </Text>
            <Text as="small">
                JavaScript, Express, React, jQuery, Ruby on Rails, Python, Golang, Gorilla Mux, PostgreSQL, MongoDB, Knex.js, HTML, CSS, Wordpress, Shopify, Wix
            </Text>
        </>
    );
};

export default Bio;
