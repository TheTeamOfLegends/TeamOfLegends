import { API_BASE_URL } from '@/constants'
import { useProfileStore } from '@/stores/profileStore'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRef } from 'react'
import { toaster } from '../../ui/toaster'
import AvatarPlaceholder from '@/assets/icons/avatar-placeholder.svg'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/dictionary'

type AvatarUploaderProps = {
  avatar: string
}

export const AvatarUploader = ({ avatar }: AvatarUploaderProps) => {
  const updateAvatar = useProfileStore(s => s.updateAvatar)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    try {
      await updateAvatar(file)

      toaster.create({
        description: SUCCESS_MESSAGES.AVATAR_CHANGE_SUCCESS,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.AVATAR_CHANGE_FAILED,
        type: 'error',
      })
    }

    e.target.value = ''
  }

  return (
    <Box
      w="130px"
      h="130px"
      rounded="full"
      cursor="pointer"
      position="relative"
      backgroundImage={
        avatar
          ? `url(${API_BASE_URL}/v2/resources${avatar})`
          : `url(${AvatarPlaceholder})`
      }
      backgroundSize="cover"
      backgroundPosition="center"
      onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAvatarChange}
      />
      <Flex
        position="absolute"
        inset={0}
        bg="blackAlpha.600"
        opacity={0}
        rounded="full"
        transition="0.2s"
        align="center"
        justify="center"
        _hover={{
          opacity: 1,
        }}>
        <Text color="white" fontSize="sm">
          Изменить
        </Text>
      </Flex>
    </Box>
  )
}
