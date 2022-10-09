import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';

const Main = ({ children }) => {
  return (
      <Box as="main" pb={0}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <titlle>Yasir Gaji - Home</titlle>
        </Head>

        <Container maxW="container.md" px={0} pt={15}>
          {children}
        </Container>
      </Box>
  );
}

export default Main;