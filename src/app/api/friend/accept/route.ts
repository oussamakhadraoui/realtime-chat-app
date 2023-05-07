import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommandRedis } from '@/utils/redis'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('unauthorize', { status: 401 })
    }
    const isfriend = await CommandRedis(
      'sismember',
      `${session.user.id}:friend`,
      idToAdd
    )

    if (isfriend) {
      return new Response('Already your friend', { status: 401 })
    }

    const hasFriendRequest = await CommandRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )

    if (hasFriendRequest) {
      return new Response('No friend request', { status: 400 })
    }

    await db.sadd(`user:${session.user.id}:friend`, idToAdd)
    await db.sadd(`user:${idToAdd}:friend`, session.user.id)
    await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd)

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Payload Request', { status: 422 })
    }
    return new Response('Invalid Request', { status: 400 })
  }
}
