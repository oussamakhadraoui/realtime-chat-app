import { authOptions } from '@/lib/auth'
import { addFriendValidator } from '@/lib/validation/add-friend'
import { getServerSession } from 'next-auth'
import { CommandRedis } from '../../../../utils/redis'
import { db } from '@/lib/db'
import { z } from 'zod'
import { pusherServer } from '@/lib/pusher'
import { pusherTransKey } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email: emailToAdd } = addFriendValidator.parse(body.email)
    const rest = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-cache',
      }
    )
    const data = (await rest.json()) as { result: string | null }
    const IdToAdd = data.result

    const session = await getServerSession(authOptions)
    if (!IdToAdd) {
      return new Response('this person does not exist', { status: 400 })
    }
    if (IdToAdd === session?.user.id) {
      return new Response('you cannot add yourself', { status: 400 })
    }
    if (!session) {
      return new Response('unauthorize', { status: 401 })
    }
    const alreadyAdded = (await CommandRedis(
      'sismember',
      `user:${IdToAdd}:incoming_friend_request`,
      session.user.id
    )) as 0 | 1
    if (alreadyAdded) {
      return new Response('you already added this user', { status: 400 })
    }

    const friend = (await CommandRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      IdToAdd
    )) as 0 | 1
    if (friend) {
      return new Response('you are already friends', { status: 400 })
    }

    await pusherServer.trigger(
      pusherTransKey(`user:${IdToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderID: session.user.id,
        senderEmail: session.user.email,
      }
    )

    db.sadd(`user:${IdToAdd}:incoming_friend_request`, session.user.id)
    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload!!', { status: 422 })
    }
    return new Response('Invalid request', { status: 400 })
  }
}
