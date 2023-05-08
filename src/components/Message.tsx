'use client'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/validation/message'
import React, { useRef, useState } from 'react'

interface MessageProps {
  initialMSG: Message[]
  sessionId: string
}

const MessageComponent: React.FC<MessageProps> = ({
  initialMSG,
  sessionId,
}) => {
  const [initialMessage, setInitialMessage] = useState<Message[]>(initialMSG)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={scrollDownRef} />
      {initialMSG.map((msg, i) => {
        const senderMSG = msg.senderId === sessionId
        // check for the msg sender to put it in the left or right
        const hasPrevMsg =
          initialMSG[i - 1]?.senderId === initialMSG[i].senderId
        // we check if he has prev msg to put the image beside the msg in the next msg and render that image in all msg

        return (
          <div className='chat-message' key={`${msg.id}-${msg.timeStamp}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': senderMSG,
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': senderMSG,
                    'order-2 items-start': !senderMSG,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': senderMSG,
                    'bg-gray-200 text-gray-900': !senderMSG,
                    'rounded-br-none': !hasPrevMsg && senderMSG,
                    'rounded-bl-none': !hasPrevMsg && !senderMSG,
                  })}
                >
                  {msg.message}{' '}
                  <span className='ml-2 text-xs text-gray-400'>
                    {msg.timeStamp}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageComponent
