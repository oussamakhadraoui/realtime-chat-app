import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async ({}) => {
  const session = await getServerSession(authOptions)
  return <p>{JSON.stringify(session)}</p>
}

export default Page
