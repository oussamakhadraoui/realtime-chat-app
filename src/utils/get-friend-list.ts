import { User } from '@/types/db'
import { CommandRedis } from './redis'

export const getFriendByUserId = async (userId: string) => {
  const listIds = (await CommandRedis(
    'smembers',
    `user:${userId}:friend`
  )) as string[]

  const listFriends = await Promise.all(
    listIds.map(async (id) => {
      const friend = (await CommandRedis('get', `user:${id}`)) as string
      const dataFriend = JSON.parse(friend) as User
      return dataFriend
    })
  )
  return listFriends
}
