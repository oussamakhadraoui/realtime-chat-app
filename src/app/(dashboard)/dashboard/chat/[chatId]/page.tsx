import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { arrayMessageValidator } from '@/lib/validation/message'
import { Message } from '@/types/db'
import { CommandRedis } from '@/utils/redis'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { User } from '@/types/db'
import Image from 'next/image'
import MessageComponent from '@/components/Message'
import ChatInput from '@/components/ChatInput'

interface PageProps {
  params: {
    chatId: string
  }
}
const getChatMessages = async (chatID: string) => {
  try {
    const results: string[] = await CommandRedis(
      'zrange',
      `chat:${chatID}:message`,
      0,
      -1
    )
    const ListMssages = results.map((message) => JSON.parse(message) as Message)
    const reverseMSG = ListMssages.reverse()
    const finalMessages = arrayMessageValidator.parse(reverseMSG)
    return finalMessages
  } catch (error) {
    notFound()
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const [chatId1, chatId2] = chatId.split('--')
  const { user } = session
  if (user.id !== chatId1 && user.id !== chatId2) {
    return notFound()
  }
  const chatPartnerID = user.id === chatId1 ? chatId2 : chatId1
  // const chatPartner = (await db.get(`user:${chatPartnerID}`)) as User
  const chatPartnerRaw = (await CommandRedis(
    'get',
    `user:${chatPartnerID}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const actualMessage = await getChatMessages(chatId)
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center py-3 justify-between border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>
          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>
            <span className='text-sm text-gray-600 '>{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <MessageComponent
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMSG={actualMessage}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}

export default Page
