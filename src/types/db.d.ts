import { FriendRequest } from '@/components/FriendRequest'
interface User {
  name: string
  image: string
  email: string
  id: string
}
interface Message {
  id: string
  receiverId: string
  message: string
  senderId: string
  timeStamp: number
}
interface Chat {
  id: string
  messages: Message[]
}
interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
}
