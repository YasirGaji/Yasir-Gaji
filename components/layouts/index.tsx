/* eslint-disable react/no-children-prop */
import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Navbar } from '../navbar'
import { Model } from '../model/index.js'
import { NoSsr } from '../no-ssr'

// import router from 'next/router';

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

        <Navbar path="/" href={''} props={undefined} children={undefined} />

        <Container maxW="container.xl" px={0} pt={75}>
          <NoSsr>
            {/* <Model /> */}
          </NoSsr>

          {children}
        </Container>
      </Box>
  );
}

