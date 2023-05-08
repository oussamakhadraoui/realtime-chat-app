'use client'
import { chatLinkGen } from '@/lib/utils'
import { Message, User } from '@/types/db'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SidebarChatListProps {
  friends: User[]
  sessionID: string
}

const SidebarChatList: React.FC<SidebarChatListProps> = ({
  friends,
  sessionID,
}) => {
  const router = useRouter()
  const PathName = usePathname()
  const [unseenMSG, setUnseenMSG] = useState<Message[]>([])
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
        const unseenMSGcount = unseenMSG.filter(
          (msg) => msg.receiverId === friend.id
        ).length //determine the number of unseen msg of a single user
        return (
          <li key={friend.id}>
            <a
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 leading-6 text-sm font-semibold'
              href={`/dashboard/chat/${chatLinkGen(friend.id, sessionID)}`}
            >
              {friend.name}
              {unseenMSG.length > 0 && (
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
