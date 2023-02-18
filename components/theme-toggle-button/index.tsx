import React from "react";
import { 
  IconButton, 
  useColorMode, 
  useColorModeValue
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";


export const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <IconButton
      aria-label={`Toggle theme, Switch to ${text} mode`}
      colorScheme={useColorModeValue("gray", "yellow")}
      icon={<SwitchIcon />}
      onClick={toggleColorMode}
    />
  );
  
}
