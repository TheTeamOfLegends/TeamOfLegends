import { addUserToLeaderboard, SCORE_KEY } from '@/api/leaderboardApi'
import { useProfileStore } from '@/stores/profileStore'
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GameButton } from '../../components/ui/GameButton/GameButton'

export type GameOverOverlayProps = {
  score: number
  highScore: number
  isNewHighScore: boolean
  onRestart: () => void
}

export const GameOverOverlay = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
}: GameOverOverlayProps) => {
  const user = useProfileStore(s => s.user)

  useEffect(() => {
    if (user) {
      addUserToLeaderboard({
        avatar: user.avatar,
        login: user.login,
        [SCORE_KEY]: score,
      })
    }
  }, [user?.id, score])

  return (
    <Flex
      position="absolute"
      inset={0}
      align="center"
      justify="center"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
      bg="rgba(8, 11, 44, 0.82)"
      backdropFilter="blur(6px)"
      zIndex={2}>
      <Box
        w="100%"
        maxW={{ base: '100%', sm: '420px' }}
        bg="linear-gradient(180deg, rgba(12, 17, 56, 0.96), rgba(8, 11, 44, 0.98))"
        border="1px solid"
        borderColor="rgba(235, 75, 118, 0.35)"
        borderRadius="12px"
        boxShadow="0 0 40px rgba(235, 75, 118, 0.15)"
        px={{ base: 5, sm: 8 }}
        py={{ base: 6, sm: 8 }}
        textAlign="center">
        <Heading
          as="h1"
          fontFamily="Orbitron, sans-serif"
          fontSize={{ base: '28px', sm: '36px' }}
          color="#EB4B76"
          letterSpacing="0.04em"
          mb={{ base: 4, sm: 6 }}>
          Game Over
        </Heading>

        {isNewHighScore && (
          <Text
            fontFamily="Orbitron, sans-serif"
            color="#FFBF00"
            fontSize={{ base: '14px', sm: '16px' }}
            mb={4}
            letterSpacing="0.06em">
            Новый рекорд!
          </Text>
        )}

        <Stack gap={2} mb={{ base: 6, sm: 8 }}>
          <Text color="white" fontSize={{ base: 'md', sm: 'lg' }}>
            Счёт:{' '}
            <Box as="span" color="#EB4B76" fontWeight="700">
              {score.toLocaleString('ru-RU')}
            </Box>
          </Text>
          <Text color="whiteAlpha.800" fontSize={{ base: 'sm', sm: 'md' }}>
            Лучший результат:{' '}
            <Box as="span" color="white" fontWeight="600">
              {highScore.toLocaleString('ru-RU')}
            </Box>
          </Text>
        </Stack>

        <Stack gap={3} align="stretch">
          <GameButton size="lg" w="100%" onClick={onRestart}>
            Играть снова
          </GameButton>
          <GameButton
            asChild
            size="lg"
            w="100%"
            variant="outline"
            bg="transparent"
            borderColor="rgba(235, 75, 118, 0.6)"
            color="white"
            _hover={{
              bg: 'rgba(235, 75, 118, 0.15)',
            }}>
            <Link to="/leaderboard">Таблица лидеров</Link>
          </GameButton>
        </Stack>

        <Text
          mt={{ base: 5, sm: 6 }}
          color="whiteAlpha.600"
          fontSize={{ base: 'xs', sm: 'sm' }}
          lineHeight="1.5">
          A / W / D — движение, мышь — прицел и выстрел
          <br />
          ESC / P — пауза
        </Text>
      </Box>
    </Flex>
  )
}
