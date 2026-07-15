import { VStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import { GameButton } from '../ui/GameButton/GameButton'

export const Hero = () => {
  return (
    <VStack align="flex-start" px={10} py={20} gap={8}>
      <Logo
        size="lg"
        accentColor="#EB4B76"
        variant="stacked"
        showIcon={false}
      />
      <Text textStyle="xl" color={'white'} maxW={'450px'}>
        Динамичный 2d-шутер в космическом пространстве. Уворачивайся от
        препятствий, собирай бонусы и набирай очки.
      </Text>
      <GameButton asChild size="xl">
        <Link to="/game">Начать игру</Link>
      </GameButton>
    </VStack>
  )
}
