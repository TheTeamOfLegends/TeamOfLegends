import { Helmet } from 'react-helmet-async'
import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'
import { Header } from '../components/Header/Header'
import { Box, Flex } from '@chakra-ui/react'
import { Hero } from '../components/Hero/Hero'
import { Navigation } from '../components/Navigation/Navigation'

export const MainPage = () => {
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'
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
          backgroundImage={
            isLight ? "url('/hero-bg-l.png')" : "url('/hero-bg.png')"
          }
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
