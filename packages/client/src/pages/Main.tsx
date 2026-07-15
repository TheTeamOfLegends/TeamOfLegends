import { Helmet } from 'react-helmet'

import { Header } from '../components/Header/Header'
import { Box, Flex } from '@chakra-ui/react'
import { Hero } from '../components/Hero/Hero'
import { Navigation } from '../components/Navigation/Navigation'

export const MainPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Space Assault</title>
        <meta
          name="description"
          content="Space Assault — динамичный 2D шутер"
        />
      </Helmet>
      <Box minH="100vh" display="flex" flexDir="column">
        <Header />
        <Flex
          direction="column"
          flex={1}
          pb={10}
          backgroundImage="url('/hero-bg.png')"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat">
          <Hero />
          <Navigation />
        </Flex>
      </Box>
    </div>
  )
}
