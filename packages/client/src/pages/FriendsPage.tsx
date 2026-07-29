import { Helmet } from 'react-helmet-async'

import { Header } from '../components/Header/Header'
import { usePage } from '../hooks/usePage'
import { useFriendsStore } from '../stores/friendsStore'
import { useProfileStore } from '../stores/profileStore'

export const FriendsPage = () => {
  const friends = useFriendsStore(s => s.data)
  const isLoading = useFriendsStore(s => s.isLoading)
  const user = useProfileStore(s => s.user)

  usePage({ initPage: initFriendsPage })
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Список друзей</title>
        <meta
          name="description"
          content="Страница со списком друзей и с информацией о пользователе"
        />
      </Helmet>
      <Header />
      {user ? (
        <>
          <h3>Информация о пользователе:</h3>{' '}
          <p>
            {user.first_name} {user.second_name}
          </p>
        </>
      ) : (
        <h3>Пользователь не найден</h3>
      )}
      {isLoading ? (
        'Загрузка списка...'
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend.name}>
              {friend.name} {friend.secondName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const initFriendsPage = async () => {
  const queue: Array<Promise<unknown>> = [
    useFriendsStore.getState().loadFriends(),
  ]

  if (!useProfileStore.getState().user) {
    queue.push(useProfileStore.getState().loadProfile())
  }

  return Promise.all(queue)
}
