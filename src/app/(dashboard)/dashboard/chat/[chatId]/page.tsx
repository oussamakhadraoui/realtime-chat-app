import React from 'react'

interface pageProps {
  params: {
    chatId: string
  }
}

const page = ({ params }: pageProps) => {
  return <div>{params.chatId}</div>
}

export default page
