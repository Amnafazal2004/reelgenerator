"use client"
import { useSession } from '@/lib/auth-client'
import React, { useEffect } from 'react'
import Signout from './Signout'
import Signin from './Signin'
import Signup from './Signup'

const Header = () => {
  const { data: session, error, isPending } = useSession()
  //session k ander saara data hoga of user database and session database 
  //error k ander, agar koi problem hojayega to wo batayega kis wajah se
  //ispending is basically k session load hua k nhi 
  
  useEffect(() => {
    console.log("Session state changed:", { session, error, isPending })
  }, [session, error, isPending])
  
  // Also check cookies
  useEffect(() => {
    console.log("All cookies:", document.cookie)
  }, [])

  if (isPending) {
    return <div>Loading session...</div>
  }
  
  if (error) {
    console.error("Session error:", error)
    return <div>Session error: {error.message}</div>
  }

  return (
    <div>
      <div>Debug: Session = {JSON.stringify(session)}</div> {/* Add this debug line */}
      {session?.user ? 
        <div>
          <p>Welcome {session.user.name || session.user.email}!</p>
          <Signout/>
        </div>
        :
        <div>
          <p>Not signed in</p>
          <Signin/>
          <Signup/>
        </div>
      }
    </div>
  )
}

export default Header