import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { Theme } from '../libs';


export default class Document extends NextDocument {
  render () {
    return (
      <Html lang="en">
        <Head />

        <body>
        <ColorModeScript initialColorMode={Theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
      </Html>      
    )
  }
}