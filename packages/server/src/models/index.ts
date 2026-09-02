import { Comment } from './Comments'
import { Topic } from './Topics'
import { User } from './Users'

Comment.belongsTo(Topic, {
  foreignKey: 'topicId',
  as: 'topic',
})

Comment.belongsTo(User, {
  foreignKey: 'author',
  as: 'user',
})

Topic.belongsTo(User, {
  foreignKey: 'author',
  as: 'user',
})

Topic.hasMany(Comment, {
  foreignKey: 'topicId',
})

User.hasMany(Topic, { foreignKey: 'author' })

User.hasMany(Comment, { foreignKey: 'author' })

export { User, Topic, Comment }
