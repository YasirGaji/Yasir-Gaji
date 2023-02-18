import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Text, useColorModeValue } from '@chakra-ui/react';
import { LogoBox } from './styles/logo';


export const Logo = () => {
  const logoImg = `/images/Logo.svg`

  return (
    <Link href="/">
        <LogoBox>
          <Image 
            src={logoImg}
            alt="yasir gaji logo"
            width={20}
            height={20}
          />

          <Text
            color={useColorModeValue('black', 'white')}
            fontFamily="M PLUS Rounded 1c"
            fontWeight="bold" ml={3}
            width="110px"
          >
            Gàjí fún rẹ́ ẹ
          </Text>
        </LogoBox>
    </Link>
  );
};


// export const Logo = () => {
//   const logoColor = useColorModeValue('black', 'white');
//   return (
//     <Link href="/">
//       <LogoBox>
//         <Image
//           src="/images/Logo.svg"
//           alt="yasir gaji logo"
//           width={50}
//           height={50}
//         />
//         <Text
//           as="span"
//           fontSize="xl"
//           fontWeight="bold"
//           color={logoColor}
//           ml={2}
//         >
//           Yasir Gaji
//         </Text>
//       </LogoBox>
//     </Link>
//   );
// };