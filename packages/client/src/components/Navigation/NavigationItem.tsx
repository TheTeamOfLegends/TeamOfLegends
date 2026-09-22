import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from '../../theme/ThemeContext'

type Props = {
  href: string
  icon: React.ReactNode
  title: string
  accentColor?: string
}

export const NavigationItem = ({ href, icon, title, accentColor }: Props) => {
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'
  return (
    <Flex
      asChild
      flex={1}
      justifyContent={{ base: 'flex-start', sm: 'center' }}
      p={{ base: 2, sm: 6 }}
      borderRadius="xl"
      bg={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={
        `color-mix(in srgb, ${accentColor} 40%, transparent)` ||
        'whiteAlpha.300'
      }
      transition="0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        bg: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
      }}>
      <Link to={href}>
        <Flex
          flexDir={{ base: 'row', sm: 'column' }}
          alignItems={{ base: 'flex-start', sm: 'center' }}
          justifyContent={{ base: 'flex-start', sm: 'center' }}
          gap={{ base: 2, sm: 3 }}>
          <Box color={accentColor || 'cyan.300'}>{icon}</Box>

          <Text fontWeight="bold" color="white" alignSelf="center">
            {title}
          </Text>
        </Flex>
      </Link>
    </Flex>
  )
}
