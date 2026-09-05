import {
  ButtonGroup,
  IconButton,
  type IconButtonProps,
  Pagination,
  usePaginationContext,
} from '@chakra-ui/react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from '../../theme/ThemeContext'

interface StarPaginationProps {
  count: number
  pageSize: number
  pageNumber: number
}

export const StarPagination = (props: StarPaginationProps) => {
  const { count, pageSize, pageNumber } = props
  const lastPageNumber = Math.ceil(count / pageSize)
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'

  const PaginationLink = (
    props: IconButtonProps & {
      page?: 'prev' | 'next' | number
      children?: React.ReactNode
    }
  ) => {
    const { page, children, ...rest } = props
    const pagination = usePaginationContext()
    const pageValue = () => {
      if (page === 'prev') return pagination.previousPage ?? 1
      if (page === 'next') return pagination.nextPage ?? pageNumber
      return page
    }
    return (
      <IconButton asChild {...rest}>
        <Link to={`?page=${pageValue()}`}>
          <span>{children}</span>
        </Link>
      </IconButton>
    )
  }

  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      defaultPage={1}
      page={pageNumber}>
      <ButtonGroup
        variant="ghost"
        size="sm"
        colorPalette={isLight ? 'black' : 'blue'}>
        <PaginationLink page="prev" disabled={pageNumber === 1}>
          {HiChevronLeft({})}
        </PaginationLink>

        <Pagination.Items
          render={page => (
            <PaginationLink
              page={page.value}
              variant={{ base: 'ghost', _selected: 'outline' }}>
              {page.value}
            </PaginationLink>
          )}
        />

        <PaginationLink page="next" disabled={pageNumber === lastPageNumber}>
          {HiChevronRight({})}
        </PaginationLink>
      </ButtonGroup>
    </Pagination.Root>
  )
}
