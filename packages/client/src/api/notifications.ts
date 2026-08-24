const GAME_NOTIFICATION_TAG = 'space-assault-return'
const GAME_NOTIFICATION_ICON = '/sw192.png'

export const isNotificationSupported = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window

export const ensureNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  return (await Notification.requestPermission()) === 'granted'
}

type ShowReturnNotificationOptions = {
  score: number
}

export const showGameReturnNotification = ({
  score,
}: ShowReturnNotificationOptions): void => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return
  }

  const body =
    score > 0
      ? `Счёт ${score} сохранён — возвращайся в игру!`
      : 'Прогресс сохранён — возвращайся в игру!'

  new Notification('Space Assault', {
    body,
    icon: GAME_NOTIFICATION_ICON,
    tag: GAME_NOTIFICATION_TAG,
  })
}
