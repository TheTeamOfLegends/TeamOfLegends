import { ForumComment } from '../../slices/forumTopicSlice'

// выведем количество комментариев равное ID топика - 1
export const commentsMock = (n: number): ForumComment[] =>
  Array.from({ length: n - 1 }, (_, index) => ({
    id: index + 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mattis dapibus libero, eleifend maximus velit hendrerit in. Etiam semper feugiat convallis. Nam condimentum at nunc vel ultricies. Sed augue metus, commodo vitae aliquet efficitur, elementum eget lacus. Nulla pellentesque, purus at tristique consectetur, massa lorem accumsan ante, eu porta ante ex id elit. Nulla quis suscipit odio. Morbi eu dui sit amet enim sagittis molestie. Sed tristique venenatis dolor facilisis tempor. Mauris ultricies, ipsum nec maximus feugiat, sem diam lacinia orci, et dignissim lorem dui eget arcu. Praesent gravida lectus nec purus interdum iaculis. Nullam aliquam congue augue a egestas. Etiam ut accumsan augue. Suspendisse at finibus libero, sed molestie ipsum.',
    author: { name: 'In', secondName: 'Cognito' },
    createdAt: '2026-07-16T12:00:00Z',
  }))
