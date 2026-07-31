import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { GameButton } from '../../components/ui/GameButton/GameButton'

export type PauseOverlayProps = {
  onResume: () => void
}

export const PauseOverlay = ({ onResume }: PauseOverlayProps) => {
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
          mb={{ base: 3, sm: 4 }}>
          Пауза
        </Heading>

        <Text
          color="whiteAlpha.800"
          fontSize={{ base: 'sm', sm: 'md' }}
          mb={{ base: 6, sm: 8 }}
          lineHeight="1.5">
          Игра на паузе. Нажмите ESC или кнопку ниже, чтобы продолжить.
        </Text>

        <Stack gap={3} align="stretch">
          <GameButton size="lg" w="100%" onClick={onResume}>
            Продолжить
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
            <Link to="/">В меню</Link>
          </GameButton>
        </Stack>

        <Text
          mt={{ base: 5, sm: 6 }}
          color="whiteAlpha.600"
          fontSize={{ base: 'xs', sm: 'sm' }}
          lineHeight="1.5">
          ESC — пауза / продолжить
        </Text>
      </Box>
    </Flex>
  )
}
