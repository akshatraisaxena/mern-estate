import React from 'react'
import {Link} from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='main w-screen h-screen bg-red-600 overflow-hidden flex'>
      <div className='left w-2/5 h-full bg-gray-50 '></div>
      <div className='right w-3/5 h-full bg-blue-200'>
        <div className='mx-auto bg-transparent max-w-lg p-2 border-2 border-white rounded-lg mt-40'>
         <h1 className='p-2 font-mono font-semibold text-3xl text-center'>SignUp</h1>
         <form className='flex flex-col gap-2 w-3/5 mx-auto' >
            <input type="text" placeholder='username' className='rounded-lg p-2 border-none outline-none bg-gray-200' id='username' />
            <input type="email" placeholder='email' className='rounded-lg p-2 border-none outline-none bg-gray-200' id='email' />
           <input type="password" placeholder='password' className='rounded-lg p-2 border-none outline-none bg-gray-200' id='password' />
           <button  className='bg-red-600 text-white rounded-lg p-2 hover:opacity-95 disabled:opacity-80'>SignUp</button>
         </form>
        </div> 
        <div className='flex items-center justify-center mt-2'>
          <p className='font-mono text-sm'>Already have an account?</p>
          <Link to={"/sign-in"}> <span className='text-blue-600 font-mono text-sm'>SignIn</span></Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp