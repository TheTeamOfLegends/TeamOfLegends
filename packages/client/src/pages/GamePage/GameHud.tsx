import { Box, Flex, Text } from '@chakra-ui/react'
import { COMBAT } from '../../game/constants'
import type { GameHudState } from '../../game/types'

export type GameHudProps = {
  hud: GameHudState
}

const HudBar = ({
  label,
  value,
  max,
  color,
  formatValue,
}: {
  label: string
  value: number
  max: number
  color: string
  formatValue?: (value: number, max: number) => string
}) => {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0

  return (
    <Box>
      <Flex justify="space-between" mb={1} gap={2}>
        <Text
          fontFamily="Orbitron, sans-serif"
          fontSize="11px"
          letterSpacing="0.08em"
          color="whiteAlpha.700"
          textTransform="uppercase">
          {label}
        </Text>
        <Text
          fontSize="11px"
          color="whiteAlpha.800"
          fontFamily="Orbitron, sans-serif"
          whiteSpace="nowrap">
          {formatValue
            ? formatValue(value, max)
            : `${Math.round(value)} / ${max}`}
        </Text>
      </Flex>
      <Box
        h="8px"
        bg="rgba(255, 255, 255, 0.08)"
        borderRadius="4px"
        overflow="hidden"
        border="1px solid"
        borderColor="rgba(235, 75, 118, 0.25)">
        <Box
          h="100%"
          w={`${ratio * 100}%`}
          bg={color}
          transition="width 0.12s ease-out"
        />
      </Box>
    </Box>
  )
}

export const GameHud = ({ hud }: GameHudProps) => {
  const machineGunSec = hud.machineGunRemainingMs / 1000
  const shotgunSec = hud.shotgunRemainingMs / 1000

  return (
    <Box
      position="absolute"
      top={{ base: 3, sm: 4 }}
      left={{ base: 3, sm: 4 }}
      zIndex={1}
      pointerEvents="none"
      w={{ base: 'min(260px, calc(100% - 24px))', sm: '280px' }}
      bg="linear-gradient(180deg, rgba(12, 17, 56, 0.92), rgba(8, 11, 44, 0.88))"
      border="1px solid"
      borderColor="rgba(235, 75, 118, 0.35)"
      borderRadius="12px"
      boxShadow="0 0 24px rgba(235, 75, 118, 0.12)"
      px={4}
      py={3}>
      <Text
        fontFamily="Orbitron, sans-serif"
        fontSize={{ base: '18px', sm: '20px' }}
        color="#EB4B76"
        letterSpacing="0.04em"
        mb={3}>
        {hud.score.toLocaleString('ru-RU')}
        <Box
          as="span"
          ml={2}
          fontSize="11px"
          color="whiteAlpha.600"
          letterSpacing="0.1em">
          SCORE
        </Box>
      </Text>

      <Box display="flex" flexDir="column" gap={3}>
        <HudBar label="HP" value={hud.hp} max={hud.maxHp} color="#8eff56" />

        {machineGunSec > 0 && (
          <HudBar
            label="Machine Gun"
            value={machineGunSec}
            max={COMBAT.machineGunDuration / 1000}
            color="#fcff4f"
            formatValue={v => `${v.toFixed(1)}s`}
          />
        )}

        {shotgunSec > 0 && (
          <HudBar
            label="Shotgun"
            value={shotgunSec}
            max={COMBAT.shotgunDuration / 1000}
            color="#a078ff"
            formatValue={v => `${v.toFixed(1)}s`}
          />
        )}
      </Box>

      <Text
        mt={3}
        fontFamily="Orbitron, sans-serif"
        fontSize="10px"
        letterSpacing="0.06em"
        color="whiteAlpha.500">
        ESC / P — пауза
      </Text>
    </Box>
  )
}
