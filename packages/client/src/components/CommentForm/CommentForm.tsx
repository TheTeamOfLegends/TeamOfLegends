import { Field, Textarea, Button, Flex } from '@chakra-ui/react'
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useNavigation,
} from 'react-router-dom'
import { ForumTopicCard } from '../ForumTopicCard/ForumTopicCard'
import { ForumAuthor } from '../../types/forum'
import { createComment } from '../../api/forumApi'
import { useForumTopicStore } from '../../stores/forumTopicStore'
import { useProfileStore } from '../../stores/profileStore'
import { useEffect, useState } from 'react'

interface CommentFormProps {
  author: ForumAuthor
  topicId: number
}

export const CommentForm = (props: CommentFormProps) => {
  const [formVersion, setFormVersion] = useState(0)
  const navigation = useNavigation()

  // управляет сбросом формы после отправки
  useEffect(() => {
    if (navigation.state === 'idle') {
      setFormVersion(prev => prev + 1)
    }
  }, [navigation.state])

  return (
    <ForumTopicCard author={props.author}>
      <Form
        key={formVersion}
        method="post"
        action={`/forum/topic/${props.topicId}/comment/new`}>
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
  const topicId = Number(params.topicId)
  const formData = await request.formData()
  const body = String(formData.get('body') ?? '').trim()
  const userId = useProfileStore.getState().user?.id

  if (!topicId || !body || !userId) {
    return redirect(`/forum/topic/${params.topicId}`)
  }

  const comment = await createComment({ topicId, body, userId })
  useForumTopicStore.getState().appendComment(comment)

  return redirect(`/forum/topic/${topicId}`)
}
