import { ChangePasswordForm, ProfileInfo } from '@/components/profile'
import { LogoutLink } from '@/components/profile/LogoutLink'
import { Flex } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/Header/Header'
import { AppSpinner } from '../../components/ui/loader/app-spinner'
import { usePage } from '../../hooks/usePage'
import { useProfileStore } from '../../stores/profileStore'
import { useContext } from 'react'
import { ThemeContext } from '../../theme/ThemeContext'

export const ProfilePage = () => {
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'
  usePage({ initPage: initProfilePage })

  const user = useProfileStore(s => s.user)
  const isLoading = useProfileStore(s => s.isLoading)

  if (isLoading) {
    return <AppSpinner />
  }

  if (!user) {
    return <div>Не удалось загрузить профиль</div>
  }

  return (
    <>
      <Helmet>
        <title>Профиль</title>
      </Helmet>
      <Header />
      <Flex
        minH="100vh"
        align="center"
        gap={12}
        py={10}
        direction="column"
        bg={isLight ? 'white' : '#080B2C'}
        color={isLight ? 'black' : 'white'}>
        <ProfileInfo user={user} />
        <ChangePasswordForm />
        <LogoutLink />
      </Flex>
    </>
  )
}

export const initProfilePage = async () => {
  await useProfileStore.getState().loadProfile()
}
