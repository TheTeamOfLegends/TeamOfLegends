import { Flex } from '@chakra-ui/react'
import { NavigationItem } from './NavigationItem'

import LeaderboardIcon from '@/assets/icons/leaderboard.svg?react'
import ForumIcon from '@/assets/icons/forum.svg?react'
import ProfileIcon from '@/assets/icons/profile.svg?react'

export const Navigation = () => {
  return (
    <Flex
      marginTop="auto"
      justify="center"
      gap={{ base: 2, sm: 6 }}
      px={{ base: 4, sm: 10 }}
      flexDir={{ base: 'column', sm: 'row' }}>
      <NavigationItem
        href="/leaderboard"
        icon={<LeaderboardIcon />}
        title="Лидерборд"
        accentColor="#FFBF00"
      />

      <NavigationItem
        href="/forum"
        icon={<ForumIcon />}
        title="Форум"
        accentColor="#5A4CFF"
      />

      <NavigationItem
        href="/profile"
        icon={<ProfileIcon />}
        title="Профиль"
        accentColor="#EB4B76"
      />
    </Flex>
  )
}
