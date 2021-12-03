import {
  Container,
  Box,
  Heading,
  Image,
  Link,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import NextLink from 'next/link'
import Section from '../components/section';
import Paragraph from '../components/paragraph'
import { ChevronRightIcon } from '@chakra-ui/icons';
import { BioSection, BioYear } from '../components/bio'

const page = () => {
  return ( 
    <Container>
      <Box borderRadius='lg' bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={3} mb={6} align='center'>
        Product Manager & Javascript Engineer based in Lagos.
      </Box>

      <Box display={{md: 'flex'}}>
        <Box flexGrow={1}>
          <Heading as='h2' variant="page-title" size='lg' mb={4}>Yasir Gaji
          </Heading>
          <p>Practising Essentialist | Fashion Enthusiast.</p>
        </Box>

        <Box flexShrink={0} mt={{base: 4, md: 0}} ml={{md:6}} align="center">
          <Image borderColor="blackAlpha" borderWidth={2} borderStyle="solid" maxWidth="100px" display="inline-block" borderRadius="full" src="/images/yasir.png" alt="Profile Image"  />
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          I'm
        </Heading>
        <Paragraph>
           Currently working with my hands to make magic happen on the web.
          <br/>
          A collaborative Product Manager with expertise building mature agile teams that deliver quality, on-deadline products that drive corporate objectives.
          <br/>
          A creative Javascript engineer with few years of Frontend Experience leveraging mark-up, Javascript with CMS to build responsive software, and interactive features that drive business growth.
          <br/>
          I facilitate continuous improvement across all levels of an organization.
          <br/>
          Check out my recent{' '}
          <NextLink href="/projects"><Link>projects</Link></NextLink>
        </Paragraph>

        <Box align="center" my={4}>
          <NextLink href="/projects">
            <Button rightIcon={<ChevronRightIcon/>} colorScheme="teal" >
              Portfolio
            </Button>
          </NextLink>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Bio
        </Heading>

        <BioSection>
          <BioYear>2002</BioYear>
          Born in Lagos. Nigeria.
        </BioSection>

        <BioSection>
          <BioYear>2019</BioYear>
          doing something 
        </BioSection>
      </Section>

    </Container>
  )
}

export default page 