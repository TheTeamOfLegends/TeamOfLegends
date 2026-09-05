import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/Header/Header'
import {
  Container,
  Heading,
  Box,
  Field,
  Input,
  Textarea,
  Button,
  Flex,
} from '@chakra-ui/react'
import { ActionFunctionArgs, Form, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ThemeContext } from '../../theme/ThemeContext'

export const ForumNewTopicPage = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const isLight = theme === 'light'

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новый топик</title>
        <meta name="description" content="создать новый топик форума" />
      </Helmet>
      <Flex flexDirection={'column'} height="100vh">
        <Header />
        <Container
          pt={8}
          m={0}
          maxW="none"
          flexGrow={1}
          bg={isLight ? 'white' : '#080B2C'}
          color={isLight ? 'black' : 'white'}>
          <Heading textAlign={'center'}>Создать новый топик</Heading>
          <Box mt={8}>
            <Form method="post" action="/forum/topic/create">
              <Flex flexDirection={'column'} gapY={8} maxW={'4xl'} m={'auto'}>
                <Field.Root>
                  <Field.Label>Заголовок</Field.Label>
                  <Input type={'text'} name={'title'} />
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Сообщение</Field.Label>
                  <Textarea rows={10} name={'body'} />
                  <Field.ErrorText></Field.ErrorText>
                </Field.Root>
                <Flex gapX={4} justifyContent={'right'}>
                  <Button
                    colorPalette={'orange'}
                    onClick={() => navigate('/forum')}>
                    Вернуться
                  </Button>
                  <Button type="submit" colorPalette={'pink'}>
                    Создать
                  </Button>
                </Flex>
              </Flex>
            </Form>
          </Box>
        </Container>
      </Flex>
    </div>
  )
}

export const newTopicCreateAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  console.log(Object.fromEntries(formData))

  return { status: 'success' }
}
