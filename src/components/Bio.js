import React from 'react';

import { Hyperlink, Text, Title } from '../styles/Typography';

const Bio = () => {
    return (
        <>
            <Title as="h5">Full stack web developer currently based in Taipei</Title>

            <Text>
                Former project manager and Bay Area resident, <br />
                <Hyperlink href="https://berkeley.edu" target="blank">Cal</Hyperlink> grad (Go Bears! 🐻), Taiwan native 🇹🇼, <br />
                D&D and sour ale enthusiast. 
            </Text>
            <Text>
                In my free time, I like playing around with web technologies and testing new recipes.
            </Text>
            <Text as="small">
                JavaScript, Express, Vue, React, jQuery, Ruby on Rails, Golang, GraphQL, PostgreSQL, MongoDB, HTML, CSS
            </Text>
        </>
    );
};

export default Bio;
