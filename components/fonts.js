import { Global } from '@emotion/react'

const Fonts = () => {
  return (
    <Global styles={`
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;1,100;1,300;1,400;1,700&display=swap")
    `} />
  )
}

export default Fonts