import { Flex } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import { GameButton } from '../ui/GameButton/GameButton'

export const Header = () => {
  const { pathname } = useLocation()
  const isGamePage = pathname === '/game'

  return (
    <Flex
      as="header"
      bg="linear-gradient(180deg,#080B2C,#0C1138)"
      width="100%"
      justifyContent={'space-between'}
      alignItems={'center'}
      minHeight={'80px'}
      px={6}
      gap={{ base: 2, sm: '0' }}
      direction={{ base: 'column', sm: 'row' }}
      py={{ base: '20px', sm: '0' }}>
      <Logo />
      {!isGamePage && (
        <GameButton
          asChild
          display={{ base: 'none', sm: 'flex' }}
          marginRight={2}>
          <Link to="/game">Начать игру</Link>
        </GameButton>
      )}
    </Flex>
  )
}
