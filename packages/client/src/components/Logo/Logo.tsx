import { Text, Link as ChakraLink, StackProps, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

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
      {showIcon && (
        <svg width={s.icon} height={s.icon} viewBox="0 0 60 60" fill="none">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="planet" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#7D6BFF" />
              <stop offset="100%" stopColor="#5B4DFF" />
            </radialGradient>
          </defs>

          <circle
            cx="30"
            cy="30"
            r="17"
            fill="#5A4CFF"
            opacity="0.18"
            filter="url(#glow)"
          />

          <circle
            cx="30"
            cy="30"
            r="14"
            fill="none"
            stroke="#4B56B8"
            strokeWidth="2"
            opacity="0.6"
          />

          <circle
            cx="30"
            cy="30"
            r="11"
            fill="none"
            stroke="#26366F"
            strokeWidth="1.5"
            opacity="0.8"
          />

          <circle cx="30" cy="30" r="9" fill="url(#planet)" />

          <rect
            x="30"
            y="28.25"
            width="17"
            height="3.5"
            rx="1.75"
            fill="#000"
          />
        </svg>
      )}

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
