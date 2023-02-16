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
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

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
        <Flex align="center" mr={5}>
          <Heading 
            as="h1" size="lg"
            letterSpacing={'tight'}
          >
            <Logo />
          </Heading>
        </Flex>

        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center" flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="/projects" path={path}>Projects</LinkItem>
          <LinkItem href="/articles" path={path}>Articles</LinkItem>
        </Stack>

        <Box flex={1} alignItems="right">

        </Box>
      </Container>
    </Box>
  )
}