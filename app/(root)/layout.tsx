import React, { ReactNode } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { isAurhenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import LogoutBtn from '@/components/LogoutBtn';
import { Toaster } from '@/components/ui/sonner';

const RootLayout = async  ({children} : {children : ReactNode}) => {

  const isUserAuthenticated = await isAurhenticated();
  if(!isUserAuthenticated) redirect('/sign-in')
  return (
    <div className='root-layout'>
      <nav className=' flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-2'>
           <Image src='/logo.svg' alt='logo' width={38} height={32}/>
           <h2 className=' text-primary-100'>PrepAi</h2>
        </Link>
        <LogoutBtn />
      </nav>
      {children}
      <Toaster />
    </div>
  )
}

export default RootLayout;
