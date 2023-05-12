import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { NextAuthOptions } from 'next-auth'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import { CommandRedis } from '@/utils/redis'
import { User } from '@/types/db'

const googleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || clientId.trim().length === 0) {
    throw new Error('Misssing client-id')
  }
  if (!clientSecret || clientSecret.trim().length === 0) {
    throw new Error('Misssing client-secret')
  }
  return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  providers: [
    GoogleProvider({
      clientId: googleCredentials().clientId,
      clientSecret: googleCredentials().clientSecret,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ user, token }) {
      const userDB = (await db.get(`user:${token.id}`)) as User | null

      if (!userDB) {
        token.id = user!.id
        return token
      }

      return {
        id: userDB.id,
        name: userDB.name,
        picture: userDB.image,
        email: userDB.email,
      }
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async redirect() {
      return '/dashboard'
    },
  },
}
