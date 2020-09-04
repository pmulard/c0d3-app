import _ from 'lodash'
import db from '../dbload'
import { Op } from 'sequelize'
import { Context } from '../../@types/helpers'

const { User, UserLesson, Star } = db

type ArgsLessonMentors = {
  lessonId: string
}

type ArgsGiveStar = {
  lessonId: string
  mentorId: number
  comment: string
}

export const getLessonMentors = async (
  _parent: void,
  args: ArgsLessonMentors
) => {
  const { lessonId } = args
  const data = await UserLesson.findAll({
    where: {
      lessonId,
      isPassed: {
        [Op.ne]: ''
      }
    }
  })
  const userIds: Array<number> = data.reduce(
    (userIdArray: Array<number>, user: any) => {
      userIdArray.push(user.userId)
      return userIdArray
    },
    []
  )
  const users = await User.findAll({
    where: {
      id: userIds
    }
  })
  return users
}

export const giveStar = async (
  _parent: void,
  args: ArgsGiveStar,
  ctx: Context
) => {
  try {
    const { lessonId, mentorId, comment } = args
    const userId = _.get(ctx, 'req.user.id', '')
    if (!args) throw new Error('Invalid Arguments')
    const givenStar = await Star.create({ userId, lessonId, mentorId, comment })
    return givenStar
  } catch (error) {
    throw new Error(error)
  }
}
