import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components'
import { AppProps } from 'next/app'
import { Theme } from '../libs'
import { Fonts } from '../components'

const Website = ({Component, pageProps, router} : AppProps) => {
  return (
    <ChakraProvider theme={Theme}>
      <Fonts />
      <Layout router={router}>
        <Component {...pageProps} key={router.route} />
      </Layout>
    </ChakraProvider>
  )
}

export default Website
