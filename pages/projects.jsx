import { Container, Box, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Section from '../components/section';
import { WorkGridItem } from '../components/grid-item'
import thumbInkdrop from '../public/images/yasir.png'

const Works = () => {
  return (
    <Container>
    <br />
      <heading as="h1" fontSize={20} mb={3}>
        Feel My MAGIC!
      </heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.3}>
          <WorkGridItem id="inkdrop" title="Inkdrop" thumbnail={thumbInkdrop}>
            A project I worked on.
          </WorkGridItem>

          <WorkGridItem id="inkdrop" title="Inkdrop" thumbnail={thumbInkdrop}>
            A project I worked on.
          </WorkGridItem>

          <WorkGridItem id="inkdrop" title="Inkdrop" thumbnail={thumbInkdrop}>
            A project I worked on.
          </WorkGridItem>

          <WorkGridItem id="inkdrop" title="Inkdrop" thumbnail={thumbInkdrop}>
            A project I worked on.
          </WorkGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  )
}

export default Works