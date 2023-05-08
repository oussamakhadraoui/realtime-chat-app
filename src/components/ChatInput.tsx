'use client'
import { User } from '@/types/db'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'

interface ChatInputProps {
  chatPartner: User
}

const ChatInput = ({ chatPartner }: ChatInputProps) => {
  const text = useRef<HTMLTextAreaElement | null>(null)
  const [value, setValue] = useState<string>('')
  const [isLoading, setIsloading] = useState<boolean>(false)
  const sendMsg = () => {}
  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={text}
          rows={1}
          placeholder={`Message ${chatPartner.name}`}
          value={value}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMsg()
            }
          }}
        />
        <div
          onClick={() => text.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrin-0'>
            <Button isLoading={isLoading} onClick={sendMsg} type='submit'>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput