import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components'
import { AppProps } from 'next/app'
import { Theme } from '../libs'
import { Fonts } from '../components'
import { AnimatePresence } from 'framer-motion'

const Website = ({Component, pageProps, router} : AppProps) => {
  return (
    <ChakraProvider theme={Theme}>
      <Fonts />
      <Layout router={router}>
        <AnimatePresence exitBeforeEnter initial={true}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </ChakraProvider>
  )
}

export default Website;
