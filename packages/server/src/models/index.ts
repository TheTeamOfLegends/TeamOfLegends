import { Comment } from './Comments'
import { Topic } from './Topics'
import { User } from './Users'
import { Reaction } from './Reactions'

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

Topic.hasMany(Reaction, { foreignKey: 'topicId' })
User.hasMany(Reaction, { foreignKey: 'userId' })
Reaction.belongsTo(Topic, { foreignKey: 'topicId' })
Reaction.belongsTo(User, { foreignKey: 'userId' })

export { User, Topic, Comment, Reaction }
