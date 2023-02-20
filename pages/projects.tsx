import {
  Container,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react'
import {Section} from '../components'
import { WorkGridItem } from '../components'

import thumbWearhighstreet from '../public/images/wearhighstreet.png' ;

const Projects = () => {
  return (
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Projects
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem 
            id="wearhighstreet" 
            title="Wear HighStreet" 
            thumbnail={thumbWearhighstreet}
          >
            Fashion as a service for the modern consumer.
          </WorkGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  )
}

export default Projects