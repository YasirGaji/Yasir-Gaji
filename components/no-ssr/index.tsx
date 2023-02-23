import React from 'react'
import dynamic from 'next/dynamic'


interface Props {
  children?: any
}

export const NoSsr = ({children} : Props) => {
  return (
    <>
      {children}
    </>
  )
}

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
})