export type Reaction = {
  emoji: string
  count: number
  reactedByMe: boolean
}

export type Reactions = {
  commentId: number
  reactions: Reaction[]
}
