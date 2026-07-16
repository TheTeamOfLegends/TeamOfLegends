import { updateAvatar } from '../../api/profileApi'
import { toaster } from '../../components/ui/toaster'

export const onAvatarSelected = async (file: File) => {
  try {
    await updateAvatar(file)

    toaster.create({
      description: 'Аватар обновлён',
      type: 'success',
    })
  } catch (error) {
    if (error instanceof Error) {
      toaster.create({
        description: error.message,
        type: 'error',
      })
    }
  }
}
