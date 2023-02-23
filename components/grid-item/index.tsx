import React, { ReactNode } from "react";
import NextLink from "next/link";
import Image, { StaticImageData } from "next/image";
import { 
  Box, 
  Center, 
  Text,  
  LinkBox, 
  LinkOverlay 
} from "@chakra-ui/react";



interface GIProps {
  children: ReactNode;
  href: string;
  title: string;
  thumbnail: string | StaticImageData;
}

interface WGIProps {
  children: ReactNode;
  href?: string;
  title: string;
  thumbnail: string | StaticImageData;
  id: string;
}


export const GridItem = ({ children, href, title, thumbnail }: GIProps) => {
  return (
  <Box w="100%">
    <Center>
      <LinkBox cursor="pointer">
        <Image
          src={thumbnail} alt={title}
          className="grid-item-thumbnail"
          placeholder="blur" loading="lazy"
        />
        <LinkOverlay href={href} target="_blank">
          <Text mt={2}>{title}</Text>
        </LinkOverlay>

        <Text fontSize={14}>{children}</Text>
      </LinkBox>
    </Center>
  </Box>
  ) 
}

export const WorkGridItem = ({ children, id, title, thumbnail }: WGIProps) => {
  return (
  <Box w="100%" >
    <Center>
      <NextLink href={`/projects/${id}`} passHref>
        <LinkBox  cursor="pointer">
          <Image 
            src={thumbnail} alt={title} 
            className="grid-item-thumbnail" 
            placeholder="blur" loading="lazy"
          />
          <LinkOverlay href={`/projects/${id}`} >
            <Text mt={2} align="center" fontSize={20}>{title}</Text>
          </LinkOverlay>
          <Text align="center" fontSize={14}>{children}</Text>
        </LinkBox>
      </NextLink>
    </Center>
  </Box> 
  )
}


export { GridItemStyle } from "./styles/gridItem";