import { useProfileStore } from './stores/profileStore'

const App = () => {
  const user = useProfileStore(s => s.user)

  return (
    <div>
      {user ? (
        <div>
          <p>{user.first_name}</p>
          <p>{user.second_name}</p>
        </div>
      ) : (
        <p>Пользователь не найден!</p>
      )}
    </div>
  )
}

export default App
