/* eslint-disable jsx-a11y/alt-text */
import { 
  Container, 
  Box, 
  Heading, 
  Image, 
  Center,
  useColorModeValue,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { 
  Section, 
  Paragraph 
} from '../components'


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
          <p>Software Engineer & Product Manager</p>
        </Box>

        <Box 
          flexShrink={0} 
          mt={{base: 9, md: 0}}
          ml={{md: 6}} mb={20}
        >
          <Center>
          <Image
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            maxWidth="100px"
            display="inline-block"
            borderRadius="full"
            src={useColorModeValue("/images/me2.jpg", "/images/me.jpg")}
            alt="Yasir Gaji"
          />
          </Center>
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as='h6' variant="section-title">
          Projects
        </Heading>
        <Paragraph>
          I love to build and facilitate continuous improvement across all levels of products that solve problems and make people&apos;s lives easier. I&apos;m also a big fan of open source and I&apos;m always looking for ways to contribute to the community. I&apos;m currently working on a few projects and I&apos;m always open to new opportunities. If you&apos;d like to get in touch.{' '}
        </Paragraph>
      </Section>
    </Container>
  )
}

export default Home



// Nigeria. I&apos;m a software engineer, product manager and writer. I love to build products that solve problems and make people&apos;s lives easier. I&apos;m also a big fan of open source and I&apos;m always looking for ways to contribute to the community. I&apos;m currently working on a few projects and I&apos;m always open to new opportunities. If you&apos;d like to get in touch, you can find me on Twitter or LinkedIn.