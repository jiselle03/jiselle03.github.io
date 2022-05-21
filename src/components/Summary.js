import React from 'react';

import { Text, Title } from '../styles/Typography';

const Summary = () => {
  return (
    <>
      <Title as="h5">Full stack web developer</Title>
      <Text as="small">
          Vue, React, Ruby on Rails, Express, Golang, GraphQL, PostgreSQL, MongoDB, HTML, CSS
      </Text>
    </>
  );
};

export default Summary;
