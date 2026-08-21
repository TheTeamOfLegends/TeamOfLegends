import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { PageInitArgs, PageInitContext } from '../types'
import { useSsrStore } from '../stores/ssrStore'

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
}

/**
 * Клиентская инициализация страницы.
 * Если текущий pathname уже был инициализирован на SSR — повторный fetch не делаем.
 */
export const usePage = ({ initPage }: PageProps) => {
  const initializedPath = useSsrStore(s => s.initializedPath)
  const setInitializedPath = useSsrStore(s => s.setInitializedPath)
  const params = useParams()
  const { pathname } = useLocation()

  useEffect(() => {
    if (initializedPath === pathname) {
      setInitializedPath(null)
      return
    }

    void initPage({
      ctx: createContext(),
      params,
    })
  }, [initializedPath, setInitializedPath, initPage, params, pathname])
}
