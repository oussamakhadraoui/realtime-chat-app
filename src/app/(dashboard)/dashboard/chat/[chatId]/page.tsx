import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { arrayMessageValidator } from '@/lib/validation/message'
import { Message } from '@/types/db'
import { CommandRedis } from '@/utils/redis'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { User } from '@/types/db'

interface PageProps {
  params: {
    chatId: string
  }
}
const getChatMessages = async (chatID: string) => {
  try {
    const results: string[] = await CommandRedis(
      'zrange',
      `chat:${chatID}:messages`,
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
  const chatPartner = (await db.get(`user:${chatPartnerID}`)) as User
  const actualMessage = await getChatMessages(chatId)
  return <div></div>
}

export default Page
