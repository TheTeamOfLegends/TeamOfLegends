import { Avatar } from '@chakra-ui/react'

type Props = {
  login: string
  avatarUrl?: string
  size?: 'sm' | 'md'
}

export const PlayerAvatar = ({ login, avatarUrl, size = 'sm' }: Props) => (
  <Avatar.Root size={size} flexShrink={0}>
    <Avatar.Fallback name={login} />
    {avatarUrl && <Avatar.Image {...({ src: avatarUrl } as object)} />}
  </Avatar.Root>
)
