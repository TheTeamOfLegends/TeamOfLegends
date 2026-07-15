import { Helmet } from 'react-helmet'

import { useSelector } from '../../store'
import { Header } from '../../components/Header/Header'
import { fetchForumThunk, selectForum } from '../../slices/forumSlice'
import { PageInitArgs } from '../../types'
import { usePage } from '../../hooks/usePage'

export const ForumPage = () => {
  const topics = useSelector(selectForum) ?? []
  const isLoading = useSelector(state => state.forum.isLoading)

  usePage({ initPage: initForumPage })
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум приложения" />
      </Helmet>
      <Header />
      <h3>Форум</h3>
      {isLoading ? (
        'Загрузка...'
      ) : (
        <ul>
          {topics.map(topic => (
            <li key={topic.id}>{topic.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const initForumPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectForum(state)) {
    return dispatch(fetchForumThunk())
  }
}
