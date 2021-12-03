import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
//import { AnimatePresence, motion } from 'framer-motion' 

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <IconButton aria-label="Toggle dark mode" colorscheme={useColorModeValue('purple', 'orange')} icon={useColorModeValue(<MoonIcon />, <SunIcon />)} onClick={toggleColorMode}></IconButton>
    
  )
}

export default ThemeToggleButton

{/* <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div style={{ display: 'inline-block'}}
      key={useColorModeValue('light', 'dark')}
      initial={{y: -20, opacity: 0}}
      animate={{y:0, opacity: 1}}
      exit={{y: 20, opacity: 0}}
      transition={{ duration: 0.2 }}>
        
      </motion.div>
    </AnimatePresence>   */}