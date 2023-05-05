'use client'
import React, { ButtonHTMLAttributes, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton = ({ ...props }: SignOutButtonProps) => {
  const [isSignOut, setIsSignOut] = useState<boolean>(false)
  const logout = async () => {
    try {
      setIsSignOut(true)
      await signOut()
    } catch (error) {
      toast.error('there is a problem sign out')
    } finally {
      setIsSignOut(false)
    }
  }
  return (
    <Button {...props} variant='ghost' onClick={logout}>
      {isSignOut ? (
        <Loader2 className='animate-spin w-4 h-4' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
    </Button>
  )
}

export default SignOutButton
