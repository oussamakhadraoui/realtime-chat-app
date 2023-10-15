import { Metadata } from "next"

export function constructMetadata({
  title = 'Gara-Chat - the real time chat platform',
  description = 'Gara-Chat is an open-source software to make chatting easy.',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@oussama',
    },
    icons,
    metadataBase: new URL('https://realtime-chat-app-teal.vercel.app'),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
