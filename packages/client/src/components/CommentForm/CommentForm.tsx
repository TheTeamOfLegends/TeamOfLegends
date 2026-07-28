import { Field, Textarea, Button, Flex } from '@chakra-ui/react'
import { ActionFunctionArgs, Form, redirect } from 'react-router-dom'
import { ForumTopicCard } from '../ForumTopicCard/ForumTopicCard'
import { User } from '../../slices/userSlice'

interface CommentFormProps {
  author: User
  topicId: number
}

export const CommentForm = (props: CommentFormProps) => {
  return (
    <ForumTopicCard author={props.author}>
      <Form method="post" action={`/forum/topic/${props.topicId}/comment/new`}>
        <Flex flexDirection={'column'} gapY={8}>
          <Field.Root>
            <Textarea rows={10} name={'body'} />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>
          <Flex gapX={4} justifyContent={'right'}>
            <Button type="submit" colorPalette={'pink'}>
              Создать
            </Button>
          </Flex>
        </Flex>
      </Form>
    </ForumTopicCard>
  )
}

export const newCommentCreateAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const topicId = params.topicId

  const formData = await request.formData()

  // Выводим в консоль id топика и тело комментария
  console.log('ID Топика:', topicId)
  console.log('Данные формы:', Object.fromEntries(formData))

  return redirect(`/forum/topic/${topicId}`)
}
