'use client'

import { pusherClient } from '@/lib/pusher'
import { pusherTransKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface FriendRequestProps {
  unseenRequest: number
  sessionId: string
}

const FriendRequest = ({ unseenRequest, sessionId }: FriendRequestProps) => {
  const [unseenRequests, setUnseenRequests] = useState<number>(unseenRequest)

  useEffect(() => {
    pusherClient.subscribe(
      pusherTransKey(`user:${sessionId}:incoming_friend_requests`)
    )
    const realTimeFunction = () => {
      setUnseenRequests((prev) => prev + 1)
    }
    pusherClient.bind('incoming_friend_requests', realTimeFunction)
    return () => {
      pusherClient.unsubscribe(
        pusherTransKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', realTimeFunction)
    }
  }, [sessionId])
  return (
    <Link
      href='/dashboard/requests'
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend Request</p>
      {unseenRequests > 0 && (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
          {unseenRequests}
        </div>
      )}
    </Link>
  )
}

export default FriendRequest
