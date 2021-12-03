import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 1.6rem;
  display: inline-flex;
  align-items: center;
  height: 3rem;
  line-height: 2rem;
  padding: 1rem;

  &:hover img {
    transform: rotate(20deg);
  }
`

const Logo = () => {
  const cloudPrintImg = `/images/cloudprint2.png`

  return (
    <Link href="/">
      <a>
        <LogoBox>
          <Image src={cloudPrintImg} alt="logo" width={30} height={30} />
          <Text color={useColorModeValue('gray.800', 'whiteAlpha.900')} fontFamily='M PLUS Rounded 1c' fontWeight="bold" ml={3}>Y G.</Text>
        </LogoBox>
      </a>
    </Link>
   )
}

export default Logo