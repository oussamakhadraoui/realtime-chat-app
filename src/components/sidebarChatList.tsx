'use client'
import { pusherClient } from '@/lib/pusher'
import { chatLinkGen, pusherTransKey } from '@/lib/utils'
import { Message, User } from '@/types/db'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ChatToast from './ChatToast'

interface SidebarChatListProps {
  friends: User[]
  sessionID: string
}

interface ExtendMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: React.FC<SidebarChatListProps> = ({
  friends,
  sessionID,
}) => {
  const router = useRouter()
  const PathName = usePathname()
  const [unseenMSG, setUnseenMSG] = useState<Message[]>([])
  useEffect(() => {
    pusherClient.subscribe(pusherTransKey(`user:${sessionID}:chats`))
    pusherClient.subscribe(pusherTransKey(`user:${sessionID}:friends`))
    const friendFunction = () => {
      router.refresh()
    }
    const chatFunction = (message: ExtendMessage) => {
      const isInChatPath =
        PathName ===
        `/dashboard/chat/${chatLinkGen(sessionID, message.senderId)}`
      if (isInChatPath) {
        return
      }
      setUnseenMSG((prev) => [...prev, message])
      console.log(unseenMSG)
      toast.custom((t) => (
        <ChatToast
          senderId={message.senderId}
          senderImg={message.senderImg}
          sessionId={sessionID}
          t={t}
          senderMessage={message.message}
          senderName={message.senderName}
        />
      ))
    }
    pusherClient.bind('chat_notification', chatFunction)
    pusherClient.bind('friend_notification', friendFunction)
    return () => {
      pusherClient.unsubscribe(pusherTransKey(`user:${sessionID}:chats`))
      pusherClient.unsubscribe(pusherTransKey(`user:${sessionID}:friends`))
      pusherClient.unbind('friend_notification', friendFunction)
      pusherClient.unbind('chat_notification', chatFunction)
    }
  }, [sessionID, router, PathName, unseenMSG])
  useEffect(() => {
    if (PathName?.includes('chat')) {
      setUnseenMSG((prev) => {
        return prev.filter((msg) => {
          !PathName.includes(msg.receiverId)
        })
      })
    }
    //determine the number of unseen msg
  }, [PathName])

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {friends.sort().map((friend) => {
        const unseenMSGcount = unseenMSG.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        //determine the number of unseen msg of a single user
        return (
          <li key={friend.id}>
            <a
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 text-sm font-semibold'
              href={`/dashboard/chat/${chatLinkGen(friend.id, sessionID)}`}
            >
              {friend.name}
              {unseenMSGcount > 0 && (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMSGcount}
                </div>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList
