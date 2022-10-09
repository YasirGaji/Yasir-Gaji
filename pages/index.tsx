import { Container, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'


const Home: NextPage = () => {
  return (
    <Container >
      <Box borderRadius="lg" bg="brown" mb={6} p={3} textAlign="center">
        Hi, I&apos;m Yasir Gaji a Product Geek based in London, UK.
      </Box>

      <Box display={{md: 'flex'}}>
        <Box flexGrow={1}>
          <Heading as='h2' variant="page-title">
            Yasir Gaji
          </Heading>
          <p>Product Geek ( Software Engineer / Product Manager / Writer )</p>
        </Box>
      </Box>
    </Container>
  )
}

export default Home
