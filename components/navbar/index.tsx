import React, { ReactNode } from "react";
import { Logo } from "../logo";
import NextLink from "next/link";
import {
  Box,
  Container,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue
} from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
import { ThemeToggleButton } from "../theme-toggle-button";

interface Props {
  path: string;
  href: string;
  children?: ReactNode;
  props?: any;
}

export const LinkItem = ({ href, path, children }: Props) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray.600", "gray.200");

  return (
    <NextLink href={href}>
      <Link
        p={2}
        bg={active ? "teal.400" : undefined}
        color={active ? "white" : inactiveColor}
      >
        {children}
      </Link>
    </NextLink>
  )
}

export const Navbar = ( props: Props ) => {
  const { path } = props;

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue("white", "gray.800")}
      style={{ backdropFilter: "blur(10px)" }}
      zIndex={1}
      {...props}
      mb={4}
    >
      <Container
        display="flex"  p={2}
        maxW="container.md"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Flex align="center" mr={20} pr={7}>
          <Heading 
            as="h1" size="lg"
            letterSpacing={'tighter'}
          >
            <Logo />
          </Heading>
        </Flex>

        <ThemeToggleButton />

        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center" flexGrow={1}
          mt={{ base: 3, md: 0 }} ml={2}
        >
          <LinkItem href="/projects" path={path}>Projects</LinkItem>
          <LinkItem href="/articles" path={path}>Articles</LinkItem>
        </Stack>

        <Box flex={1} alignItems="right">
          
          <Box 
            display={{ base: "block", md: "none" }}
            ml={2}
          >
            <Menu>
              <MenuButton 
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
                <MenuList>
                  <NextLink href="/">
                    <MenuItem as={Link} >About</MenuItem>
                  </NextLink>

                  <NextLink href="/projects">
                    <MenuItem as={Link} >Projects</MenuItem>
                  </NextLink>

                  <NextLink href="/articles">
                    <MenuItem as={Link} >Articles</MenuItem>
                  </NextLink>
                  <MenuItem as={Link} href="https://www.yasirgaji.com">View Source</MenuItem>
                </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}