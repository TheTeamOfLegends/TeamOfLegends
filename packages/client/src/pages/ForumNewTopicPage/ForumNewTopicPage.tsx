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
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useNavigate,
} from 'react-router-dom'
import { createTopic } from '../../api/forumApi'
import { useForumStore } from '../../stores/forumStore'
import { useForumTopicStore } from '../../stores/forumTopicStore'
import { useProfileStore } from '../../stores/profileStore'

export const ForumNewTopicPage = () => {
  const navigate = useNavigate()

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Новый топик</title>
        <meta name="description" content="создать новый топик форума" />
      </Helmet>
      <Header />
      <Container pt={8}>
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
    </div>
  )
}

export const newTopicCreateAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  const userId = useProfileStore.getState().user?.id

  if (!title || !body || !userId) {
    return { status: 'error' }
  }

  const topic = await createTopic({ title, body, userId })
  useForumStore.getState().resetForum()
  useForumTopicStore.getState().seedTopic(topic)

  return redirect(`/forum/topic/${topic.id}`)
}
