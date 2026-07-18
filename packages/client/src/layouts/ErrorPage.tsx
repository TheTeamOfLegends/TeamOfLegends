import { Helmet } from 'react-helmet'

import { Header } from '../components/Header/Header'
import { Box, Flex, Text } from '@chakra-ui/react'

type ErrorPageProps = {
  errorCode: string
  errorText: string
}

export const ErrorPage = ({ errorCode, errorText }: ErrorPageProps) => {
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{errorCode}</title>
        <meta name="description" />
      </Helmet>
      <Box minH="100vh" display="flex" flexDir="column">
        <Header />
        <Flex
          direction="column"
          flex={1}
          flexGrow={1}
          pb={10}
          justify="center"
          align="center"
          backgroundImage="url('/hero-bg.png')"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat">
          <Box
            as="h1"
            fontSize={{ base: '96px', md: '128px', lg: '160px' }}
            fontWeight="bold"
            color="white"
            textAlign="center"
            lineHeight="1">
            <Text fontFamily="Orbitron">{errorCode}</Text>
            <Text
              mt={4}
              fontSize={{ base: '24px', md: '32px' }}
              fontWeight="medium">
              {errorText}
            </Text>
          </Box>
        </Flex>
      </Box>
    </div>
  )
}
