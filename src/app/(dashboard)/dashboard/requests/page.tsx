import FriendRequests from '@/components/FriendRequests'
import { authOptions } from '@/lib/auth'
import { CommandRedis } from '@/utils/redis'
import { getServerSession } from 'next-auth'
import Email from 'next-auth/providers/email'
import { notFound } from 'next/navigation'
import React from 'react'

interface RequestProps {}

const Request = async ({}: RequestProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const idsIncomingRequest = (await CommandRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_request`
  )) as string[]

  const IncomingRequests = await Promise.all(
    idsIncomingRequest.map(async (senderID) => {
      const sender = (await CommandRedis('get', `user:${senderID}`)) as string
      const emailParser = JSON.parse(sender).email
      return {
        senderID,
        senderEmail: emailParser,
      }
    })
  )

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          sessionID={session.user.id}
          incomingReq={IncomingRequests}
        ></FriendRequests>
      </div>
    </main>
  )
}

export default Request
