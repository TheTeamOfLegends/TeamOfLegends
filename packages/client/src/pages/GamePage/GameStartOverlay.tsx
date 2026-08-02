import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react'
import { StartButton } from '../../components/ui/StartButton/StartButton'

export type GameStartOverlayProps = {
  onRestart: () => void
}

export const GameStartOverlay = ({ onRestart }: GameStartOverlayProps) => {
  return (
    <Flex
      position="absolute"
      inset={0}
      align="center"
      justify="center"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
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
          Let's Play!
        </Heading>

        <Stack gap={3} align="center">
          <StartButton size="lg" onClick={onRestart}>
            PLAY
          </StartButton>
        </Stack>

        <Text
          mt={{ base: 5, sm: 6 }}
          color="whiteAlpha.600"
          fontSize={{ base: 'xs', sm: 'sm' }}
          lineHeight="1.5">
          A / W / D — движение, мышь — прицел и выстрел
        </Text>
      </Box>
    </Flex>
  )
}
