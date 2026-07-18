import { User } from '@/types/user'
import { Box, Flex, Text } from '@chakra-ui/react'
import { AvatarUploader } from '../AvatarUploader'

import { ProfileItem } from './ProfileItem'

type ProfileInfoProps = {
  user: User
}

export const ProfileInfo = ({
  user: { first_name, second_name, email, login, phone, avatar, display_name },
}: ProfileInfoProps) => {
  const profileFields = [
    ['Имя', first_name],
    ['Фамилия', second_name],
    ['Отображаемое имя', display_name],
    ['Логин', login],
    ['Email', email],
    ['Телефон', phone],
  ] as const

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      justify="stretch"
      w="full"
      maxWidth="510px"
      gap={10}>
      <Flex direction="column" alignItems="center" gap={2}>
        <AvatarUploader avatar={avatar} />
        <Text fontWeight="bold">{first_name}</Text>
      </Flex>
      <Box>
        {profileFields.map(([title, value]) => (
          <ProfileItem key={title} title={title} value={value} />
        ))}
      </Box>
    </Flex>
  )
}
