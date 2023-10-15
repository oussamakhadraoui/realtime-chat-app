import Provider from '../components/Provider'
import './globals.css'
import { Inter } from 'next/font/google'
import {constructMetadata} from '../lib/metadata' 
const inter = Inter({ subsets: ['latin'] })

export const metadata =constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
