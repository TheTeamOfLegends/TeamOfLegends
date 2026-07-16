import { Box, Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { panelStyles, titleStyles } from './LeaderboardPanel.styles'

type Props = {
  title?: string
  children: ReactNode
}

export const LeaderboardPanel = ({ title = 'rating', children }: Props) => (
  <Box {...panelStyles}>
    <Heading {...titleStyles}>{title}</Heading>
    {children}
  </Box>
)
