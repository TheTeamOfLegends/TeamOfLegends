import { Flex, Text } from '@chakra-ui/react'

type ProfileItemProps = {
  title: string
  value: string
}

export const ProfileItem = ({ title, value }: ProfileItemProps) => {
  return (
    <Flex
      py={2}
      justify="space-between"
      align="center"
      fontSize="13px"
      w="100%"
      borderBottomWidth={1}
      _last={{
        borderBottom: 'none',
      }}>
      <Text fontWeight="bold">{title}</Text>
      <Text color="fg.subtle">{value}</Text>
    </Flex>
  )
}
