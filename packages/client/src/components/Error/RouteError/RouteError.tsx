import { useNavigate, useRouteError } from 'react-router-dom'
import { useEffect } from 'react'
import { Button, Flex, Box, Text } from '@chakra-ui/react'

export const RouteError = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    console.error('В приложении произошла ошибка:', error)
  }, [])

  return (
    <Flex
      as={'main'}
      position={'fixed'}
      inset={0}
      flexDirection={'column'}
      justify={'center'}
      alignItems={'center'}
      bg={'gray.100'}>
      <Box>
        <Text>
          На сайте произошла ошибка.
          <br />
          Обновите страницу или вернитесь на главную.
        </Text>
        <Flex gap={'12px'} mt={'20px'}>
          <Button onClick={() => window.location.reload()}>Обновить</Button>
          <Button onClick={() => navigate('/', { replace: true })}>
            На главную
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}
