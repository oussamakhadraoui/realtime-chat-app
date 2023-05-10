import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_ID!,
  cluster: 'eu',
  secret: process.env.PUSHER_SECRET!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  useTLS: true, //data trafic
})

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  { cluster: 'eu' }
)
