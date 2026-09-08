import { useContext } from 'react'
import { ThemeContext } from '../../theme/ThemeContext'
import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import { ThemeButton } from '../ui/ThemeButton/ThemeButton'

export const Header = () => {
  const { pathname } = useLocation()
  const isGamePage = pathname === '/game'
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'

  return (
    <Flex
      as="header"
      bg={
        isLight
          ? 'linear-gradient(180deg, #193572, #354cb4)'
          : 'linear-gradient(180deg, #080B2C, #0C1138)'
      }
      width="100%"
      justifyContent={'space-between'}
      alignItems={'center'}
      minHeight={'80px'}
      px={6}
      gap={{ base: 2, sm: '0' }}
      direction={{ base: 'column', sm: 'row' }}
      py={{ base: '20px', sm: '0' }}>
      <Logo />
      <ThemeButton />
    </Flex>
  )
}
