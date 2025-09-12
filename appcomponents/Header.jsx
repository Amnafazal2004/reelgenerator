"use client"
import { useSession } from '@/lib/auth-client'
import React from 'react'
import Signout from './Signout';
import Signin from './Signin';
import Signup from './Signup';

const Header = () => {
    const {data: session} = useSession();
    console.log(session)

  return (
    <div>
        {session?.user ?
         <Signout/> :
        <>
        <Signin/>
        <Signup/>
        </>
        }

    </div>
  )
}

export default Header