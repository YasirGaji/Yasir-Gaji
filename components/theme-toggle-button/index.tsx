import React from "react";
import { 
  IconButton, 
  useColorMode, 
  useColorModeValue
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from "framer-motion";


export const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        style={{ display: "inline-block" }}
        key={useColorModeValue('light', 'dark')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label={`Toggle theme, Switch to ${text} mode`}
          colorScheme={useColorModeValue("gray", "yellow")}
          icon={<SwitchIcon />}
          onClick={toggleColorMode}
        />
      </motion.div>
    </AnimatePresence>
  );
  
}
