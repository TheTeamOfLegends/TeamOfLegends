import { ChangePasswordForm, ProfileInfo } from '@/components/profile'
import { Flex } from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { Header } from '../../components/Header/Header'
import { AppSpinner } from '../../components/ui/loader/app-spinner'
import { useInitProfile } from '../../hooks/useInitProfile'
import { useProfileStore } from '../../stores/profileStore'

export const ProfilePage = () => {
  useInitProfile()

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
        bg="bg.panel"
        gap={12}
        py={10}
        mx={6}
        direction="column">
        <ProfileInfo user={user} />
        <ChangePasswordForm />
      </Flex>
    </>
  )
}

export const initProfilePage = async () => {
  await useProfileStore.getState().loadProfile()
}
