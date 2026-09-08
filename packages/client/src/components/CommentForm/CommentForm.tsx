import { Field, Textarea, Button, Flex } from '@chakra-ui/react'
import { ActionFunctionArgs, Form, redirect } from 'react-router-dom'
import { ForumTopicCard } from '../ForumTopicCard/ForumTopicCard'
import { ForumAuthor } from '../../types/forum'
import { createComment } from '../../api/forumApi'
import { useForumTopicStore } from '../../stores/forumTopicStore'
import { useProfileStore } from '../../stores/profileStore'

interface CommentFormProps {
  author: ForumAuthor
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
  const topicId = Number(params.topicId)
  const formData = await request.formData()
  const body = String(formData.get('body') ?? '').trim()
  const userId = useProfileStore.getState().user?.id

  if (!topicId || !body || !userId) {
    return redirect(`/forum/topic/${params.topicId}`)
  }

  await createComment({ topicId, body, userId })
  await useForumTopicStore.getState().loadTopic(topicId, true)

  return redirect(`/forum/topic/${topicId}`)
}
