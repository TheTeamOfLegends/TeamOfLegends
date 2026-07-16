import { Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { GameButton } from '../ui/GameButton/GameButton'
import {
  actionsStyles,
  actionButtonStyles,
  cancelButtonStyles,
} from './LeaderboardActions.styles'

export const LeaderboardActions = () => (
  <Flex {...actionsStyles}>
    <GameButton asChild {...actionButtonStyles}>
      <Link to="/game">Попробовать ещё раз</Link>
    </GameButton>

    <GameButton asChild {...cancelButtonStyles}>
      <Link to="/">Отмена</Link>
    </GameButton>
  </Flex>
)
