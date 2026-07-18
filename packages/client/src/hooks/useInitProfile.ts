import { useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'

export const useInitProfile = () => {
  const user = useProfileStore(s => s.user)
  const loadProfile = useProfileStore(s => s.loadProfile)

  useEffect(() => {
    if (!user) {
      loadProfile()
    }
  }, [user, loadProfile])
}
