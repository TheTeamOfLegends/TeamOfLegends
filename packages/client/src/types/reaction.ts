export type Reaction = {
  emoji: string
  count: number
  reactedByMe: boolean
}

export type Reactions = {
  reactions: Reaction[]
}
