import React from 'react';
import { StyledDiv } from './styles/section';


// interface SectionProps {
//   children: ReactNode;
//   delay?: number;
// }

export const Section = ({ children, delay=0 }) => {
  return (
    <StyledDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      mb={6}
    >
      {children}
    </StyledDiv>
  )
}