import { z } from 'zod'

export const messageValidator = z.object({
  id: z.string(),
  receiverId: z.string(),
  message: z.string(),
  senderId: z.string(),
  timeStamp: z.number(),
})

export const arrayMessageValidator = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>
