import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

export const usePage = ({ initPage }: PageProps) => {
  const pageHasBeenInitializedOnServer = useSsrStore(
    s => s.pageHasBeenInitializedOnServer
  )
  const setPageHasBeenInitializedOnServer = useSsrStore(
    s => s.setPageHasBeenInitializedOnServer
  )
  const params = useParams()

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      setPageHasBeenInitializedOnServer(false)
      return
    }

    initPage({
      ctx: createContext(),
      params,
    })
  }, [
    pageHasBeenInitializedOnServer,
    setPageHasBeenInitializedOnServer,
    initPage,
    params,
  ])
}
