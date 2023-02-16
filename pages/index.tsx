import { Container, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'


const Home: NextPage = () => {
  return (
    <Container >
      <Box 
        borderRadius="lg" 
        color="white" 
        bg="#2F0B0D" 
        mb={6} p={3} 
        textAlign="center"
      >
        Hi, I&apos;m a geek based in Lagos / London
      </Box>

      <Box display={{md: 'flex'}}>
        <Box flexGrow={1}>
          <Heading as='h2' variant="page-title">
            Yasir Gaji
          </Heading>
          <p>iBuild ( Software Engineer / Product Manager / Writer )</p>
        </Box>
      </Box>
    </Container>
  )
}

export default Home



// Nigeria. I&apos;m a software engineer, product manager and writer. I love to build products that solve problems and make people&apos;s lives easier. I&apos;m also a big fan of open source and I&apos;m always looking for ways to contribute to the community. I&apos;m currently working on a few projects and I&apos;m always open to new opportunities. If you&apos;d like to get in touch, you can find me on Twitter or LinkedIn.