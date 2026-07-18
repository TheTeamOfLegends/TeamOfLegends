import { Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { GameButton } from '../ui/GameButton/GameButton'
import { LeaderboardAction } from './types'
import {
  actionsStyles,
  actionButtonStyles,
  cancelButtonStyles,
} from './LeaderboardActions.styles'

type Props = {
  primary: LeaderboardAction
  secondary: LeaderboardAction
}

export const LeaderboardActions = ({ primary, secondary }: Props) => (
  <Flex {...actionsStyles}>
    <GameButton asChild {...actionButtonStyles}>
      <Link to={primary.to}>{primary.label}</Link>
    </GameButton>

    <GameButton asChild {...cancelButtonStyles}>
      <Link to={secondary.to}>{secondary.label}</Link>
    </GameButton>
  </Flex>
)
