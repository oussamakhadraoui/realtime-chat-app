'use client'
import { pusherClient } from '@/lib/pusher'
import { pusherTransKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
  incomingReq: incomingFriendRequest[]
  sessionID: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingReq,
  sessionID,
}) => {
  const [incomingFriendReq, setIncomingFriendReq] =
    useState<incomingFriendRequest[]>(incomingReq)
  const router = useRouter()
  const acceptFriend = async (id: string) => {
    await axios.post('/api/friend/accept', { id })
    setIncomingFriendReq((prev) => prev.filter((item) => item.senderID !== id))
    router.refresh()
  }
  const deny = async (id: string) => {
    await axios.post('/api/friend/deny', { id })
    setIncomingFriendReq((prev) => prev.filter((item) => item.senderID !== id))
    router.refresh()
  }
  useEffect(() => {
    pusherClient.subscribe(
      pusherTransKey(`user:${sessionID}:incoming_friend_requests`)
    )
    console.log(pusherClient)
    const friendRequestHandler = ({
      senderID,
      senderEmail,
    }: incomingFriendRequest) => {
      console.log('function got called')
      setIncomingFriendReq((prev) => [...prev, { senderID, senderEmail }])
    }

    pusherClient.bind(`incoming_friend_requests`, friendRequestHandler)
    return () => {
      pusherClient.unbind(`incoming_friend_requests`)
      pusherClient.unsubscribe(
        pusherTransKey(`user:${sessionID}:incoming_friend_requests`)
      )
    }
  }, [sessionID])
  return (
    <>
      {incomingFriendReq.length === 0 ? (
        <p className='text-sm text-zinc-500'>No friend Request!!</p>
      ) : (
        incomingFriendReq.map((item) => {
          return (
            <div key={item.senderID} className='flex gap-4 items-center'>
              <UserPlus className='text-black' />
              <p className='font-medium text-lg'>{item.senderEmail}</p>
              <button
                onClick={() => acceptFriend(item.senderID)}
                aria-label='accept friend'
                className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
              >
                <Check className='font-semibold text-white w-3/4 h-3/4' />
              </button>
              <button
                onClick={() => deny(item.senderID)}
                aria-label='accept friend'
                className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
              >
                <X className='font-semibold text-white w-3/4 h-3/4' />
              </button>
            </div>
          )
        })
      )}
    </>
  )
}

export default FriendRequests
