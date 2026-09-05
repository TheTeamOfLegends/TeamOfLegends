import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'

export class ThemeUser extends Model<
  InferAttributes<ThemeUser>,
  InferCreationAttributes<ThemeUser>
> {
  declare id: CreationOptional<number>
  declare userId: string
  declare userThemes?: NonAttribute<UserTheme[]>

  static initModel(sequelize: Sequelize): void {
    ThemeUser.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'theme_users',
        timestamps: true,
      }
    )
  }
}

export class Theme extends Model<
  InferAttributes<Theme>,
  InferCreationAttributes<Theme>
> {
  declare id: CreationOptional<number>
  declare theme: string

  static initModel(sequelize: Sequelize): void {
    Theme.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        theme: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'themes',
        indexes: [
          {
            fields: ['theme'],
          },
        ],
        timestamps: false,
        paranoid: true,
      }
    )
  }
}

export class UserTheme extends Model<
  InferAttributes<UserTheme>,
  InferCreationAttributes<UserTheme>
> {
  declare id: CreationOptional<number>
  declare themeId: number
  declare device: string | null
  declare ownerId: number

  static initModel(sequelize: Sequelize): void {
    UserTheme.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        themeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Theme,
            key: 'id',
          },
        },
        device: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ownerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'owner_id',
          references: {
            model: 'theme_users',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'user_themes',
        timestamps: false,
        paranoid: true,
      }
    )
  }
}
