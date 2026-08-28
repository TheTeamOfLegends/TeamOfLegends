import { Button, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { Reaction } from '../../types/reaction'

interface ReactionBarProps {
  reactions?: Reaction[]
  onReactionClick: (emoji: string) => void
}

const AVAILABLE_EMOJIS = [
  '😀',
  '😂',
  '😍',
  '😢',
  '😡',
  '👍',
  '❤️',
  '🎉',
  '🔥',
  '👀',
]

export const ReactionBar = ({
  reactions = [],
  onReactionClick,
}: ReactionBarProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const myReaction = reactions.find(reaction => reaction.reactedByMe)

  const availableEmojis = AVAILABLE_EMOJIS.filter(
    emoji => emoji !== myReaction?.emoji
  )

  const reactionColor = 'color-mix(in srgb, #EB4B76 40%, transparent)'
  const buttonSize = '26px'

  const handleEmojiClick = (emoji: string) => {
    onReactionClick(emoji)
    setIsPickerOpen(false)
  }

  return (
    <VStack
      align="flex-start"
      position="relative"
      width="fit-content"
      minWidth={135}>
      <HStack>
        {reactions.map(reaction => (
          <Button
            key={reaction.emoji}
            size="xs"
            paddingX={2}
            height={buttonSize}
            borderRadius={6}
            borderColor="#EB4B76"
            color="#000000"
            _hover={{
              backgroundColor: reactionColor,
            }}
            transition="background-color 0.2s ease"
            fontSize="16px"
            backgroundColor={
              reaction.reactedByMe
                ? 'color-mix(in srgb, #EB4B76 20%, transparent)'
                : 'transparent'
            }
            onClick={() => onReactionClick(reaction.emoji)}>
            {reaction.emoji} {reaction.count}
          </Button>
        ))}

        <Button
          variant="outline"
          size="xs"
          padding={1}
          width={buttonSize}
          height={buttonSize}
          borderRadius={6}
          borderColor="#EB4B76"
          color="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{
            backgroundColor: reactionColor,
          }}
          transition="background-color 0.2s ease"
          onClick={() => setIsPickerOpen(prev => !prev)}>
          +
        </Button>
      </HStack>

      {isPickerOpen && (
        <SimpleGrid
          columns={3}
          position="absolute"
          top="32px"
          left="auto"
          right="0"
          padding={2}
          gap={1}
          bg={'gray.100'}
          border="1px solid"
          borderColor="#EB4B76"
          borderRadius={6}
          zIndex={10}>
          {availableEmojis.map(emoji => (
            <Button
              key={emoji}
              variant="ghost"
              _hover={{
                backgroundColor: reactionColor,
              }}
              width={buttonSize}
              height={buttonSize}
              fontSize="20px"
              transition="background-color 0.2s ease"
              size="sm"
              padding={1}
              onClick={() => handleEmojiClick(emoji)}>
              {emoji}
            </Button>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  )
}
