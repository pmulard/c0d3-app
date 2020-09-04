import db from '../../helpers/dbload'
import { Context } from '../../@types/helpers'
import { isAdmin } from '../../helpers/isAdmin'
import { Op } from 'sequelize'
const { User, UserLesson } = db

export const allUsers = async (
  _parent: void,
  _args: void,
  context: Context
) => {
  const { req } = context
  const data = await UserLesson.findAll({
    where: {
      lessonId: 5,
      isPassed: {
        [Op.ne]: ''
      }
    }
  })
  const userIds: Array<number> = data.reduce((acc: Array<number>, val: any) => {
    acc.push(val.userId)
    return acc
  }, [])
  const users = await User.findAll({
    where: {
      id: userIds
    }
  })
  return !isAdmin(req) ? null : User.findAll()
}
