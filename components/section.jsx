// import {motion} from 'framer-motion';
// const figure = motion
import { useSpring, animated } from 'react-spring';
import { chakra, shouldForwardProp } from '@chakra-ui/react'

  // const [state, toggle] = useState(true)
  // const { x } = useSpring({ from: { x: 0 }, x: state ? 1 : 0, config: { duration: 1000 } })

const StyledDiv = chakra(animated.div, {
  shouldForwardProp: prop => {
    return shouldForwardProp(prop) || prop === 'transition'
  }
})

const Section = ({ children, delay = 0 }) => (
  <StyledDiv
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay }}
    mb={6}
  >
    {children}
  </StyledDiv>
)

export default Section