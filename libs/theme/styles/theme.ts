import { mode } from "@chakra-ui/theme-tools";

interface Props {
  props: any;
}

export const styles = {
  global: (props: Props) => ({
    body: {
      bg: mode("gray.50", "gray.900")(props),
    }
  })
}


export const componenets = {
  Heading: {
    Variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4,
      }
    }
  },

  Link: {
    baseStyle: (props: Props) => ({
      color: mode("#3d7aed", "#ff63c3")(props),
      textUnderlineOffset: 3,
    })
  }
}

export const fonts = {
  heading: "'M PLUS Rounded 1c', inter",
}

export const  colors = {
  glassTeal: "#88ccca",
}

export const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}

export const Link = {
  baseStyle: (props: Props) => ({
    color: mode("#3d7aed", "#ff63c3")(props),
  })
}