import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { GridItemStyle } from '../grid-item/styles/gridItem'


interface LayoutProps {
  children: ReactNode
  router?: any
  title?: string
}

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
}

export const Layout = ( { children, title }:LayoutProps ) => {
  return (
    <motion.article
      initial="hidden" animate="enter"
      exit="exit" variants={variants}
      transition={{ duration: 0.5, type:'easeInOut' }}
      style={{ position: 'relative' }}
    >
      <>
        {title && (
          <Head>
            <title>
              {title} - Yasir Gaji
            </title>
          </Head>
        )}
        {children}
        <GridItemStyle />
      </>
    </motion.article>
  )
}