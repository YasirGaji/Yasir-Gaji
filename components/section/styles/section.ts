import { motion } from 'framer-motion';
import { chakra, shouldForwardProp } from '@chakra-ui/react';

// interface SectionProps {
//   props: any;
// }

export const StyledDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'transition',
});