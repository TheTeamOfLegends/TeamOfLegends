import { ERROR_MESSAGES } from '@/dictionary'
import { Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/profileApi'
import { toaster } from '@/components/ui/toaster'

export const LogoutLink = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()

      navigate('/sign-in', { replace: true })
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.REQUEST_FAILED,
        type: 'error',
      })
    }
  }

  return (
    <Link
      color="gray.500"
      fontWeight="medium"
      fontSize="14px"
      onClick={handleLogout}
      cursor="pointer"
      transition="color 0.2s ease"
      _hover={{
        color: 'red.500',
        textDecoration: 'underline',
      }}>
      Выйти
    </Link>
  )
}
