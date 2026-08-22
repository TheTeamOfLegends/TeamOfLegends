import { Text, Link as ChakraLink, StackProps, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import PlayerIcon from '@/assets/game/player.svg?react'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  accentColor?: string
  variant?: 'horizontal' | 'stacked'
  showIcon?: boolean
} & StackProps

const sizes = {
  sm: {
    icon: 42,
    font: '18px',
  },
  md: {
    icon: 60,
    font: '24px',
  },
  lg: {
    icon: 84,
    font: {
      base: '40px',
      sm: '60px',
      md: '80px',
    },
  },
}

export const Logo = ({
  size = 'md',
  accentColor = '#FFFFFF',
  variant = 'horizontal',
  showIcon = true,
  ...props
}: LogoProps) => {
  const s = sizes[size]

  const content = (
    <HStack gap={3} {...props}>
      {showIcon && <PlayerIcon width={40} />}

      <Text
        fontFamily="Orbitron"
        fontWeight="700"
        fontSize={s.font}
        letterSpacing="0.08em"
        lineHeight={1}
        textTransform="uppercase"
        userSelect="none">
        <Text
          as="span"
          color="white"
          display={variant === 'horizontal' ? 'inline' : 'block'}>
          STAR
        </Text>{' '}
        <Text as="span" color={accentColor}>
          SHOOTER
        </Text>
      </Text>
    </HStack>
  )

  return (
    <ChakraLink asChild _hover={{ textDecoration: 'none' }}>
      <RouterLink to="/">{content}</RouterLink>
    </ChakraLink>
  )
}
