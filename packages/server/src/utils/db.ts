import type { Model, ModelStatic } from 'sequelize'

/**
 * Данные из бд можно получить через модель, а можно через сырой sql запрос
 * Будет проблема при передачи таких данных на клиент из-за различий
 * в определении имени колонки в модели sequelize и самой БД,
 * например в бд мы храним topic_id, в модели же задан алиас topicId
 * Данная функция сконвертирует названия колонок в их алиасы, заданные в модели
 * @param rows сырая выборка из БД, соответствующая модели Model
 * @param Model модель
 * @returns
 */
export function mapRawToModel<T>(
  rows: Record<string, unknown>[],
  Model: ModelStatic<Model>
): T[] {
  const modelAttributes = Model.getAttributes()
  const modelAttributesRules = new Map()

  Object.entries(modelAttributes).forEach(([id, modelAttribute]) => {
    modelAttributesRules.set(modelAttribute.field, id)
  })

  return rows.map(row =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        modelAttributesRules.get(key),
        value,
      ])
    )
  ) as T[]
}
