import React from 'react'
import {Link , useNavigate} from 'react-router-dom'
import { useState } from 'react'

function SignIn (){
  const [formData, setformData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate =  useNavigate()
  const handleChange = (e) => {
    setformData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    // handle form submission
  try {
    const res = await fetch('/api/auth/signin',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }
    )
    const data = await res.json();
    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    } 
    setLoading(false);
    setError(null);
    navigate('/');
       // Redirect to login page after successful signup
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
  };
  return (
    <div className='main w-screen h-screen bg-red-600 overflow-hidden flex'>
      <div className='left w-2/5 h-full bg-gray-50 '></div>
      <div className='right w-3/5 h-full bg-blue-200'>
        <div className='mx-auto bg-transparent max-w-lg p-2 border-2 border-white rounded-lg mt-40'>
         <h1 className='p-2 font-mono font-semibold text-3xl text-center'>SignIn</h1>
         <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-3/5 mx-auto' >
            <input type="email" placeholder='email' className='rounded-lg p-2 border-none outline-none bg-gray-200' id='email'onChange={handleChange} />
           <input type="password" placeholder='password' className='rounded-lg p-2 border-none outline-none bg-gray-200' id='password' onChange={handleChange}/>
           <button disabled={loading}  className='bg-red-600 text-white rounded-lg p-2 hover:opacity-95 disabled:opacity-80'>
            {loading ? 'loading...': 'Sign In'}</button>
         </form>
        </div> 
        <div className='flex items-center justify-center mt-2'>
          <p className='font-mono text-sm'>Dont have an account?</p>
          <Link to={"/sign-up"}> <span className='text-blue-600 font-mono text-sm'>SignUp</span></Link>
          {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p> 
            )}
        </div>
      </div>
    </div>
  )
}

export default SignIn