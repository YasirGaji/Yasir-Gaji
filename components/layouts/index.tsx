import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  router?: any;
}

export const MainLayout = ({ children }: Props) => {
  return (
      <Box as="main" pb={0}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Yasir Gaji - Home</title>
        </Head>

        <Container maxW="container.xl" px={0} pt={15}>
          {children}
        </Container>
      </Box>
  );
}

